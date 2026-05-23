# Adamas TypeScript API

`@adamasvr/sdk` is the TypeScript API for building VR projects on the Adamas platform. It provides rendering, physics, device, user, interaction, and networking APIs, and integrates directly into a standard Node.js and TypeScript development workflow.

The package is published on npm:

- [`@adamasvr/sdk`](https://www.npmjs.com/package/@adamasvr/sdk)

Because it is distributed as a standard npm package, it can be installed into any Node.js project and used alongside the broader npm ecosystem. Other Adamas-compatible packages can also depend on it. One example is [`@adamasvr/imgui`](https://github.com/adamas-vr/imgui-adamas), which demonstrates how additional packages can be built on top of the SDK and consumed from Adamas projects.

## What Is an Adamas VR Project?

An Adamas VR project is a standard Node.js and TypeScript project with `@adamasvr/sdk` for building VR projects on the Adamas platform. In addition to scripting, an Adamas project can include editor-authored scene data and assets managed through Project Studio.

Compared with a traditional game-engine workflow for VR development, an Adamas project is designed to provide:

- A standard npm-based development model that integrates directly with existing Node.js and TypeScript ecosystem.
- Higher-level VR runtime APIs for common systems such as interaction, devices, users, physics, and networking.
- A modular project model oriented around shared virtual spaces and reusable packages, rather than monolithic applications where infrastructure is tightly bundled with 3D content.
- A workflow that reduces the amount of custom infrastructure required to build networked and interactive VR experiences.

You can start from a conventional `npm init` project and install `@adamasvr/sdk` directly, or you can create a project through Adamas Hub. When a project is created from Adamas Hub, Project Studio initializes a `.adamas` folder on top of the standard Node.js project structure and adds 3D entity and component editing to the existing TypeScript workflow.

## Getting Started

There are two common ways to create an Adamas VR project.

### Option 1: Standard Node.js + TypeScript Workflow

Install the SDK into an existing project:

```bash
npm install @adamasvr/sdk
```

From there, development follows a standard TypeScript workflow within your existing Node.js toolchain.

### Option 2: Create a Project with Adamas Hub

This is the recommended approach.

1. Download [Adamas Hub](https://www.adamasvr.com/).
2. Create a new Adamas project in Project Studio.
3. Project Studio generates the project template and installs the required dependencies automatically, including `@adamasvr/sdk`.

This approach provides a standard Node.js project together with the additional Adamas editor workflow.

## Typical Project Entry Point

Projects created with Project Studio typically include an entry point similar to the following:

```ts
import { Project } from "@adamasvr/sdk";
import { projectBundle } from "adamasvr:editor";

Project.FromBundle(projectBundle).Launch(async (sceneGraph, project) => {});
```

When a project is created through Project Studio in Adamas Hub, a template like this is generated automatically.

`adamasvr:editor` is resolved by the Adamas toolchain and allows the custom compiler to reference assets imported through Project Studio.

`sceneGraph` contains the entities and components configured in the 3D editor, allowing TypeScript code to reference those authored objects directly, as shown below.

```ts
const grabble = sceneGraph["@Network Grabble"].entityId;
const networkHover = sceneGraph["@Network Grabble"]["@Hovered"].entityId;
const networkSelect = sceneGraph["@Network Grabble"]["@Selected"].entityId;
const networkAct = sceneGraph["@Network Grabble"]["@Activated"].entityId;
```

## Documentation

The following resources are useful when integrating the SDK into a project or working with the broader Adamas toolchain:

- The [Adamas Hub documentation](https://docs.adamasvr.com/) provides product documentation, workflow guidance, and general platform concepts, including Project Studio usage.
- The [API documentation](https://docs.adamasvr.com/docs/api/) is the primary reference for the API surface, including available types, classes, and runtime APIs.
- The [Adamas Hub download page](https://www.adamasvr.com/) is the starting point for developers who want to use Project Studio to scaffold and author Adamas projects.
- The [Adamas Discord community](https://www.adamasvr.com/community/discord) is the best place to follow ecosystem updates, ask implementation questions, and discuss workflow issues with the team and other developers.

## Samples

For working examples, refer to the official [`adamas-vr/samples`](https://github.com/adamas-vr/samples) repository. It contains example projects that demonstrate common SDK usage patterns, project structure, and integrations that are useful when building production Adamas applications.
