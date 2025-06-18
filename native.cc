#include <napi.h>
#include <RpcClient.h>

struct TsfnContext
{
    TsfnContext(Napi::Env env): deferred(Napi::Promise::Deferred::New(env)) {}

    // Native Promise returned to JavaScript
    Napi::Promise::Deferred deferred;

    Napi::ThreadSafeFunction tsfn;

    static void Destroy(Napi::Env env, void* finalizeData, TsfnContext* context)
    {
        // Resolve the Promise previously returned to JS via the CreateTSFN method.
        context->deferred.Resolve(Napi::Boolean::New(env, true));
        delete context;
    }
};

Napi::Number RpcGetClientId(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    return Napi::Number::New(env, RpcClient::Get().GetClientId());
}

Napi::Value RpcCall(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    if (info.Length() != 2)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsString() || !info[1].IsString())
    {
        Napi::TypeError::New(env, "Wrong arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string functionName = info[0].As<Napi::String>().Utf8Value();
    std::string jsonArgs = info[1].As<Napi::String>().Utf8Value();

    std::string resultStr = RpcClient::Get().Call(functionName, jsonArgs);
    return Napi::String::New(env, resultStr);
}

Napi::Value RpcRegisterCbHandler(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    if (info.Length() != 1)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsFunction())
    {
        Napi::TypeError::New(env, "Wrong arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    TsfnContext* context = new TsfnContext(env);

    context->tsfn = Napi::ThreadSafeFunction::New(
        env,                           // Environment
        info[0].As<Napi::Function>(),  // JS function from caller
        "TSFN",                        // Resource name
        0,                             // Max queue size (0 = unlimited).
        1,                             // Initial thread count
        context,                       // Context,
        TsfnContext::Destroy,          // Finalizer
        (void*)nullptr                 // Finalizer data
    );

    RpcClient::Get().RegisterCallbackHandler([=] (int callbackId, const std::string& jsonArgs)
    {
        napi_status status = context->tsfn.BlockingCall(context,
            [=](Napi::Env env, Napi::Function jsCallback, TsfnContext* ctx) {
                jsCallback.Call({
                    Napi::Number::New(env, callbackId),
                    Napi::String::New(env, jsonArgs)
                });
            }
        );

        if (status != napi_ok) {
            Napi::Error::Fatal("ThreadEntry",
                "Napi::ThreadSafeNapi::Function.BlockingCall() failed"
            );
        }
    });

    return context->deferred.Promise();
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
    RpcClient::Get(6969, true);

    exports.Set(Napi::String::New(env, "Rpc_Call"), Napi::Function::New(env, RpcCall));
    exports.Set(Napi::String::New(env, "Rpc_RegisterCbHandler"), Napi::Function::New(env, RpcRegisterCbHandler));
    exports.Set(Napi::String::New(env, "Rpc_GetClientId"), Napi::Function::New(env, RpcGetClientId));
    return exports;
}

NODE_API_MODULE(hello, Init)
