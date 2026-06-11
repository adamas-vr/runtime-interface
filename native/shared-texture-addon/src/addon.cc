#include "shared_texture_bridge.h"

#include <cstring>
#include <node_api.h>
#include <stdexcept>
#include <string>
#include <vector>

using adamas::shared_texture::GetSharedTextureBridge;

namespace
{
std::string GetString(napi_env env, napi_value value)
{
    size_t length = 0;
    napi_get_value_string_utf8(env, value, nullptr, 0, &length);
    std::string result(length, '\0');
    napi_get_value_string_utf8(env, value, result.data(), result.size() + 1, &length);
    result.resize(length);
    return result;
}

int32_t GetInt32(napi_env env, napi_value value)
{
    int32_t result = 0;
    napi_get_value_int32(env, value, &result);
    return result;
}

std::vector<uint8_t> GetUint8Array(napi_env env, napi_value value)
{
    bool is_typed_array = false;
    napi_is_typedarray(env, value, &is_typed_array);
    if (!is_typed_array)
        throw std::runtime_error("Expected Uint8Array.");

    napi_typedarray_type type;
    size_t length = 0;
    void* data = nullptr;
    napi_value array_buffer;
    size_t byte_offset = 0;
    napi_get_typedarray_info(env, value, &type, &length, &data, &array_buffer, &byte_offset);
    if (type != napi_uint8_array)
        throw std::runtime_error("Expected Uint8Array.");

    auto* bytes = static_cast<uint8_t*>(data);
    return std::vector<uint8_t>(bytes, bytes + length);
}

void ThrowError(napi_env env, const std::exception& ex)
{
    napi_throw_error(env, nullptr, ex.what());
}

napi_value CreateInt32(napi_env env, int32_t value)
{
    napi_value result;
    napi_create_int32(env, value, &result);
    return result;
}

napi_value OpenSharedTexture(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value argv[1];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    try
    {
        int32_t handle = GetSharedTextureBridge().OpenSharedTexture(GetString(env, argv[0]));
        return CreateInt32(env, handle);
    }
    catch (const std::exception& ex)
    {
        ThrowError(env, ex);
        return nullptr;
    }
}

napi_value CloseSharedTexture(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value argv[1];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    try
    {
        GetSharedTextureBridge().CloseSharedTexture(GetInt32(env, argv[0]));
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }
    catch (const std::exception& ex)
    {
        ThrowError(env, ex);
        return nullptr;
    }
}

napi_value WriteRGBA(napi_env env, napi_callback_info info)
{
    size_t argc = 2;
    napi_value argv[2];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    try
    {
        auto data = GetUint8Array(env, argv[1]);
        GetSharedTextureBridge().WriteRGBA(GetInt32(env, argv[0]), data.data(), data.size());
        napi_value undefined;
        napi_get_undefined(env, &undefined);
        return undefined;
    }
    catch (const std::exception& ex)
    {
        ThrowError(env, ex);
        return nullptr;
    }
}

napi_value ReadRGBA(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value argv[1];
    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    try
    {
        std::vector<uint8_t> data = GetSharedTextureBridge().ReadRGBA(GetInt32(env, argv[0]));
        napi_value array_buffer;
        void* bytes = nullptr;
        napi_create_arraybuffer(env, data.size(), &bytes, &array_buffer);
        std::memcpy(bytes, data.data(), data.size());

        napi_value typed_array;
        napi_create_typedarray(env, napi_uint8_array, data.size(), array_buffer, 0, &typed_array);
        return typed_array;
    }
    catch (const std::exception& ex)
    {
        ThrowError(env, ex);
        return nullptr;
    }
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_property_descriptor descriptors[] = {
        { "openSharedTexture", nullptr, OpenSharedTexture, nullptr, nullptr, nullptr, napi_default, nullptr },
        { "closeSharedTexture", nullptr, CloseSharedTexture, nullptr, nullptr, nullptr, napi_default, nullptr },
        { "writeRGBA", nullptr, WriteRGBA, nullptr, nullptr, nullptr, napi_default, nullptr },
        { "readRGBA", nullptr, ReadRGBA, nullptr, nullptr, nullptr, napi_default, nullptr },
    };

    napi_define_properties(env, exports, sizeof(descriptors) / sizeof(descriptors[0]), descriptors);
    return exports;
}
} // namespace

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
