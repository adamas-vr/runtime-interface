#pragma once

#include <cstdint>
#include <string>
#include <vector>

namespace adamas::shared_texture
{
class SharedTextureBridge
{
public:
    virtual ~SharedTextureBridge() = default;

    virtual int32_t OpenSharedTexture(const std::string& share_token_json) = 0;
    virtual void CloseSharedTexture(int32_t native_handle) = 0;
    virtual void WriteRGBA(int32_t native_handle, const uint8_t* data, size_t length) = 0;
    virtual std::vector<uint8_t> ReadRGBA(int32_t native_handle) = 0;
};

SharedTextureBridge& GetSharedTextureBridge();
} // namespace adamas::shared_texture
