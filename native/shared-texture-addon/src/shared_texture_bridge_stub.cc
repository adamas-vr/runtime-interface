#if !defined(__APPLE__) && !defined(_WIN32)

#include "shared_texture_bridge.h"

#include <stdexcept>

namespace adamas::shared_texture
{
namespace
{
class StubSharedTextureBridge final : public SharedTextureBridge
{
public:
    int32_t OpenSharedTexture(const std::string& share_token_json) override
    {
        throw std::runtime_error(
            "Shared texture native backend is not implemented for this platform/build. Token: " +
            share_token_json
        );
    }

    void CloseSharedTexture(int32_t) override
    {
    }

    void WriteRGBA(int32_t, const uint8_t*, size_t) override
    {
        throw std::runtime_error("Shared texture native backend cannot write RGBA frames yet.");
    }

    std::vector<uint8_t> ReadRGBA(int32_t) override
    {
        throw std::runtime_error("Shared texture native backend cannot read RGBA frames yet.");
    }
};
} // namespace

SharedTextureBridge& GetSharedTextureBridge()
{
    static StubSharedTextureBridge bridge;
    return bridge;
}
} // namespace adamas::shared_texture

#endif
