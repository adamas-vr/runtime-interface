{
  "targets": [
    {
      "target_name": "adamas_shared_texture",
      "cflags_cc": [
        "-fexceptions"
      ],
      "sources": [
        "src/addon.cc",
        "src/shared_texture_bridge_stub.cc",
        "src/shared_texture_bridge_win.cc",
        "src/shared_texture_bridge_mac.mm"
      ],
      "conditions": [
        ["OS==\"mac\"", {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "OTHER_LDFLAGS": [
              "-framework",
              "Foundation",
              "-framework",
              "Metal",
              "-framework",
              "IOSurface"
            ],
            "CLANG_CXX_LANGUAGE_STANDARD": "c++17"
          }
        }],
        ["OS==\"win\"", {
          "libraries": [
            "d3d11.lib",
            "dxgi.lib"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "AdditionalOptions": ["/std:c++17"],
              "ExceptionHandling": 1
            }
          }
        }]
      ]
    }
  ]
}
