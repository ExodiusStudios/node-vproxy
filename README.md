# sceptre
> A dynamic virtual host HTTP proxy for Node

## Installation & usage

You can install this package from npm
```
npm install --save sceptre
```

In order to create a sceptre proxy, import the module into your code
and call the `createServer` function. The returned server proxy can be
started by calling the `listen` function.

*Example:*