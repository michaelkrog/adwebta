# Adwebta

**This is only the beginning**

This library is only just taking off. Currently it is just a clone of Shoelace, but the idea is that it will change into components based on (Adwaita)[https://gnome.pages.gitlab.gnome.org/libadwaita/] design, making it possible create Gnome like experiences on the Web and ultimately build both native and web applications from the same code base based on the (Swift programming language)[https://www.swift.org].

These are the steps to get there....

## 1: Build web components based on Adwaita design language
The current repository (Adwebta) will be changed into containing Adwaita specific web components. This will allow for having web based building blocks that looks and feels like the components delivered via libadwaita. These components will be usable via HTML and therefore also usable by Javascript frameworks as Angular and Vue.

## 2: Create Swift library for Adwebta
Further down the line a Swift-library will be created for Adwebta, with an interface similar to (Adwaita-swift)[https://git.aparoksha.dev/aparoksha/adwaita-swift]. This will allow for writing declaritive UI applications in Swift, compile it to Wasm and run it in the browser. Without the need of a single line of Typescript/Javascript code.

## 3: Backend for Aparoksha
Even further down the line a new backend will be created for (Aparoksha)[https://www.aparoksha.dev]. When this is in place (and Aparoksha also has matured) it will allow for building applications in Swift with a single UI code base for both Native and Web applications **using the native UI framework on each platform**.

## Using native UI frameworks makes a difference
Many have tried to create UI framework that works across platforms. Flutter is a popular choice for mobile devices and now even also for Web. Gtk is also a UI toolkit that can be used across platforms. But most cross platform UI toolkits fails in one important factor: _They do not use native UI frameworks._

Using native UI frameworks across platforms can make a big difference, because each platform put a lot of energy into the native elements delivered by the platform. In the browser for example, input fields can have direct access to the password-manager on the platform. On mobile devices or tablet a datepicker can deliver an experience that has been meticulously designed for that device. 

For the web platform it also makes a huge difference to the bundle size, as the majority of the logic for the native elements are already there, and does not need to be downloaded.

## This is what it currently is

A forward-thinking library of Adwaita-based web components.

- Works with all frameworks 🧩
- Works with CDNs 🚛
- Fully customizable with CSS 🎨
- Includes an official dark theme 🌛
- Built with accessibility in mind ♿️
- Open source 😸

Designed in Slagelse by [Michael Krog](https://github.com/michaelkrog).

---
<!--
Documentation: [shoelace.style](https://shoelace.style)
-->

Source: [github.com/michaelkrog/adwebta](https://github.com/michaelkrog/adwebta)


---

## Developers 

Developers can use this documentation to learn how to build Adwebta from source. You will need Node >= 14.17 to build and run the project locally.

**You don't need to do any of this to use Adwebta!** This page is for people who want to contribute to the project, tinker with the source, or create a custom build of Adwebta.

<!--
If that's not what you're trying to do, the [documentation website](https://shoelace.style) is where you want to be.
-->

### What are you using to build Adwebta?

Components are built with [LitElement](https://lit-element.polymer-project.org/), a custom elements base class that provides an intuitive API and reactive data binding. The build is a custom script with bundling powered by [esbuild](https://esbuild.github.io/).

### Forking the Repo

Start by [forking the repo](https://github.com/michaelkrog/adwebta/fork) on GitHub, then clone it locally and install dependencies.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/adwebta
cd adwebta
npm install
```

### Developing

Once you've cloned the repo, run the following command.

```bash
npm start
```

This will spin up the dev server. After the initial build, a browser will open automatically. There is currently no hot module reloading (HMR), as browser's don't provide a way to reregister custom elements, but most changes to the source will reload the browser automatically.

### Building

To generate a production build, run the following command.

```bash
npm run build
```

### Creating New Components

To scaffold a new component, run the following command, replacing `sl-tag-name` with the desired tag name.

```bash
npm run create sl-tag-name
```

This will generate a source file, a stylesheet, and a docs page for you. When you start the dev server, you'll find the new component in the "Components" section of the sidebar.

### Contributing

Adwebta is an open source project and contributions are encouraged! If you're interesting in contributing, please review the [contribution guidelines](CONTRIBUTING.md) first.

## License

Adwebta was created by [Michael Krog](https://github.com/michaelkrog) and is available under the terms of the MIT license.

Whether you're building Adwebta or building something _with_ Adwebta — have fun! 🥾
