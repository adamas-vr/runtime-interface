#ifdef __APPLE__

#include "shared_texture_bridge.h"

#import <Foundation/Foundation.h>
#import <Metal/Metal.h>
#import <IOSurface/IOSurface.h>

#include <algorithm>
#include <mutex>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

namespace adamas::shared_texture
{
namespace
{
struct SharedTextureRecord
{
    IOSurfaceRef surface = nullptr;
    id<MTLTexture> texture = nil;
    int32_t width = 0;
    int32_t height = 0;
};

std::mutex g_mutex;
std::unordered_map<int32_t, SharedTextureRecord> g_records;
int32_t g_next_id = 1;
id<MTLDevice> g_device = nil;

id<MTLDevice> GetMetalDevice()
{
    if (g_device == nil)
    {
        g_device = [MTLCreateSystemDefaultDevice() retain];
    }
    return g_device;
}

int32_t ParseIntField(const std::string& json, const std::string& key)
{
    const std::string needle = "\"" + key + "\":";
    const size_t pos = json.find(needle);
    if (pos == std::string::npos)
        throw std::runtime_error("Shared texture token is missing '" + key + "'.");

    size_t start = pos + needle.size();
    size_t end = start;
    while (end < json.size() && (json[end] == '-' || (json[end] >= '0' && json[end] <= '9')))
        ++end;

    return static_cast<int32_t>(std::stoi(json.substr(start, end - start)));
}

bool ParseBoolField(const std::string& json, const std::string& key)
{
    const std::string needle = "\"" + key + "\":";
    const size_t pos = json.find(needle);
    if (pos == std::string::npos)
        return false;

    const size_t start = pos + needle.size();
    return json.compare(start, 4, "true") == 0;
}

id<MTLTexture> CreateTextureForSurface(IOSurfaceRef surface, int32_t width, int32_t height, bool linear)
{
    id<MTLDevice> device = GetMetalDevice();
    if (device == nil)
        return nil;

    MTLTextureDescriptor* descriptor =
        [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:(linear ? MTLPixelFormatRGBA8Unorm : MTLPixelFormatRGBA8Unorm_sRGB)
                                                           width:width
                                                          height:height
                                                       mipmapped:NO];
    descriptor.usage = MTLTextureUsageShaderRead | MTLTextureUsageShaderWrite | MTLTextureUsageRenderTarget | MTLTextureUsagePixelFormatView;
    if (@available(macOS 10.11, *))
    {
        descriptor.storageMode = MTLStorageModeShared;
    }

    return [device newTextureWithDescriptor:descriptor iosurface:surface plane:0];
}

class MacSharedTextureBridge final : public SharedTextureBridge
{
public:
    int32_t OpenSharedTexture(const std::string& share_token_json) override
    {
        const int32_t io_surface_id = ParseIntField(share_token_json, "ioSurfaceId");
        const int32_t width = ParseIntField(share_token_json, "width");
        const int32_t height = ParseIntField(share_token_json, "height");
        const bool linear = ParseBoolField(share_token_json, "linear");

        IOSurfaceRef surface = IOSurfaceLookup(io_surface_id);
        if (surface == nullptr)
            throw std::runtime_error("Failed to open IOSurface from shared texture token.");

        id<MTLTexture> texture = CreateTextureForSurface(surface, width, height, linear);
        if (texture == nil)
        {
            CFRelease(surface);
            throw std::runtime_error("Failed to create Metal texture for IOSurface.");
        }

        std::lock_guard<std::mutex> lock(g_mutex);
        const int32_t native_handle = g_next_id++;
        SharedTextureRecord record;
        record.surface = surface;
        record.texture = texture;
        record.width = width;
        record.height = height;
        g_records.emplace(native_handle, std::move(record));
        return native_handle;
    }

    void CloseSharedTexture(int32_t native_handle) override
    {
        std::lock_guard<std::mutex> lock(g_mutex);
        auto it = g_records.find(native_handle);
        if (it == g_records.end())
            return;

        if (it->second.texture != nil)
            [it->second.texture release];
        if (it->second.surface != nullptr)
            CFRelease(it->second.surface);
        g_records.erase(it);
    }

    void WriteRGBA(int32_t native_handle, const uint8_t* data, size_t length) override
    {
        std::lock_guard<std::mutex> lock(g_mutex);
        auto it = g_records.find(native_handle);
        if (it == g_records.end())
            throw std::runtime_error("Shared texture handle was not found.");

        const size_t expected = static_cast<size_t>(it->second.width) * static_cast<size_t>(it->second.height) * 4;
        if (length != expected)
            throw std::runtime_error("Shared texture RGBA byte length does not match the texture size.");

        const MTLRegion region = MTLRegionMake2D(0, 0, it->second.width, it->second.height);
        [it->second.texture replaceRegion:region
                              mipmapLevel:0
                                withBytes:data
                              bytesPerRow:it->second.width * 4];
    }

    std::vector<uint8_t> ReadRGBA(int32_t native_handle) override
    {
        std::lock_guard<std::mutex> lock(g_mutex);
        auto it = g_records.find(native_handle);
        if (it == g_records.end())
            throw std::runtime_error("Shared texture handle was not found.");

        const size_t byte_count = static_cast<size_t>(it->second.width) * static_cast<size_t>(it->second.height) * 4;
        std::vector<uint8_t> rgba(byte_count);
        const MTLRegion region = MTLRegionMake2D(0, 0, it->second.width, it->second.height);
        [it->second.texture getBytes:rgba.data()
                         bytesPerRow:it->second.width * 4
                          fromRegion:region
                         mipmapLevel:0];
        return rgba;
    }
};
} // namespace

SharedTextureBridge& GetSharedTextureBridge()
{
    static MacSharedTextureBridge bridge;
    return bridge;
}
} // namespace adamas::shared_texture

#endif
