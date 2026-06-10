#ifdef _WIN32

#include "shared_texture_bridge.h"

#include <d3d11.h>
#include <dxgi.h>
#include <wrl/client.h>

#include <algorithm>
#include <cstring>
#include <cstdint>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

namespace adamas::shared_texture
{
namespace
{
using Microsoft::WRL::ComPtr;

struct SharedTextureRecord
{
    ComPtr<ID3D11Texture2D> shared_texture;
    ComPtr<ID3D11Texture2D> staging_texture;
    int32_t width = 0;
    int32_t height = 0;
};

std::unordered_map<int32_t, SharedTextureRecord> g_records;
int32_t g_next_id = 1;
ComPtr<ID3D11Device> g_device;
ComPtr<ID3D11DeviceContext> g_context;

void EnsureDevice()
{
    if (g_device && g_context)
        return;

    UINT flags = 0;
    D3D_FEATURE_LEVEL feature_level = D3D_FEATURE_LEVEL_11_0;
    const D3D_FEATURE_LEVEL requested_levels[] = {
        D3D_FEATURE_LEVEL_11_1,
        D3D_FEATURE_LEVEL_11_0,
        D3D_FEATURE_LEVEL_10_1,
        D3D_FEATURE_LEVEL_10_0,
    };

    HRESULT hr = D3D11CreateDevice(
        nullptr,
        D3D_DRIVER_TYPE_HARDWARE,
        nullptr,
        flags,
        requested_levels,
        static_cast<UINT>(std::size(requested_levels)),
        D3D11_SDK_VERSION,
        g_device.GetAddressOf(),
        &feature_level,
        g_context.GetAddressOf());

    if (FAILED(hr))
    {
        throw std::runtime_error("Failed to create D3D11 device for shared texture addon.");
    }
}

uint64_t ParseUInt64Field(const std::string& json, const std::string& key)
{
    const std::string needle = "\"" + key + "\":";
    const size_t pos = json.find(needle);
    if (pos == std::string::npos)
        throw std::runtime_error("Shared texture token is missing '" + key + "'.");

    size_t start = pos + needle.size();
    size_t end = start;
    while (end < json.size() && ((json[end] >= '0' && json[end] <= '9')))
        ++end;

    return std::stoull(json.substr(start, end - start));
}

int32_t ParseIntField(const std::string& json, const std::string& key)
{
    return static_cast<int32_t>(ParseUInt64Field(json, key));
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

ComPtr<ID3D11Texture2D> CreateStagingTexture(int32_t width, int32_t height, bool linear)
{
    D3D11_TEXTURE2D_DESC desc = {};
    desc.Width = static_cast<UINT>(width);
    desc.Height = static_cast<UINT>(height);
    desc.MipLevels = 1;
    desc.ArraySize = 1;
    desc.Format = linear ? DXGI_FORMAT_R8G8B8A8_UNORM : DXGI_FORMAT_R8G8B8A8_UNORM_SRGB;
    desc.SampleDesc.Count = 1;
    desc.Usage = D3D11_USAGE_STAGING;
    desc.CPUAccessFlags = D3D11_CPU_ACCESS_READ | D3D11_CPU_ACCESS_WRITE;

    ComPtr<ID3D11Texture2D> texture;
    HRESULT hr = g_device->CreateTexture2D(&desc, nullptr, texture.GetAddressOf());
    if (FAILED(hr))
        throw std::runtime_error("Failed to create D3D11 staging texture.");

    return texture;
}

class WinSharedTextureBridge final : public SharedTextureBridge
{
public:
    int32_t OpenSharedTexture(const std::string& share_token_json) override
    {
        EnsureDevice();

        const uint64_t shared_handle_value = ParseUInt64Field(share_token_json, "sharedHandle");
        const int32_t width = ParseIntField(share_token_json, "width");
        const int32_t height = ParseIntField(share_token_json, "height");
        const bool linear = ParseBoolField(share_token_json, "linear");
        HANDLE shared_handle = reinterpret_cast<HANDLE>(static_cast<uintptr_t>(shared_handle_value));

        ComPtr<ID3D11Texture2D> shared_texture;
        HRESULT hr = g_device->OpenSharedResource(
            shared_handle,
            __uuidof(ID3D11Texture2D),
            reinterpret_cast<void**>(shared_texture.GetAddressOf()));

        if (FAILED(hr) || !shared_texture)
            throw std::runtime_error("Failed to open D3D11 shared texture from token.");

        SharedTextureRecord record;
        record.shared_texture = shared_texture;
        record.staging_texture = CreateStagingTexture(width, height, linear);
        record.width = width;
        record.height = height;

        const int32_t native_handle = g_next_id++;
        g_records.emplace(native_handle, std::move(record));
        return native_handle;
    }

    void CloseSharedTexture(int32_t native_handle) override
    {
        g_records.erase(native_handle);
    }

    void WriteRGBA(int32_t native_handle, const uint8_t* data, size_t length) override
    {
        auto it = g_records.find(native_handle);
        if (it == g_records.end())
            throw std::runtime_error("Shared texture handle was not found.");

        const size_t expected = static_cast<size_t>(it->second.width) * static_cast<size_t>(it->second.height) * 4;
        if (length != expected)
            throw std::runtime_error("Shared texture RGBA byte length does not match the texture size.");

        D3D11_MAPPED_SUBRESOURCE mapped = {};
        HRESULT hr = g_context->Map(
            it->second.staging_texture.Get(),
            0,
            D3D11_MAP_WRITE,
            0,
            &mapped);
        if (FAILED(hr))
            throw std::runtime_error("Failed to map D3D11 staging texture for write.");

        const uint8_t* source = data;
        uint8_t* destination = static_cast<uint8_t*>(mapped.pData);
        const size_t src_row_bytes = static_cast<size_t>(it->second.width) * 4;

        for (int32_t row = 0; row < it->second.height; row++)
        {
            std::memcpy(destination + row * mapped.RowPitch, source + row * src_row_bytes, src_row_bytes);
        }

        g_context->Unmap(it->second.staging_texture.Get(), 0);
        g_context->CopyResource(it->second.shared_texture.Get(), it->second.staging_texture.Get());
        g_context->Flush();
    }

    std::vector<uint8_t> ReadRGBA(int32_t native_handle) override
    {
        auto it = g_records.find(native_handle);
        if (it == g_records.end())
            throw std::runtime_error("Shared texture handle was not found.");

        const size_t byte_count = static_cast<size_t>(it->second.width) * static_cast<size_t>(it->second.height) * 4;
        std::vector<uint8_t> rgba(byte_count);

        g_context->CopyResource(it->second.staging_texture.Get(), it->second.shared_texture.Get());

        D3D11_MAPPED_SUBRESOURCE mapped = {};
        HRESULT hr = g_context->Map(
            it->second.staging_texture.Get(),
            0,
            D3D11_MAP_READ,
            0,
            &mapped);
        if (FAILED(hr))
            throw std::runtime_error("Failed to map D3D11 staging texture for read.");

        uint8_t* source = static_cast<uint8_t*>(mapped.pData);
        const size_t dst_row_bytes = static_cast<size_t>(it->second.width) * 4;
        for (int32_t row = 0; row < it->second.height; row++)
        {
            std::memcpy(rgba.data() + row * dst_row_bytes, source + row * mapped.RowPitch, dst_row_bytes);
        }

        g_context->Unmap(it->second.staging_texture.Get(), 0);
        return rgba;
    }
};
} // namespace

SharedTextureBridge& GetSharedTextureBridge()
{
    static WinSharedTextureBridge bridge;
    return bridge;
}
} // namespace adamas::shared_texture

#endif
