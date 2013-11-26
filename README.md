gulp_node_example
=================

An example gulpfile for Node projects


About
-----

This project is an example Gulpfile that does the standard 5 CI tasks:

1. clean
2. Version
3. Test
4. Build
5. Deploy

The sample Node project has two files that you'll want to replace with your content:

- /index.js
- /test/index.js

These files are part of the gulp script:

- /Gulpfile.js
- /gulpLib/**
- /package.json: merge the devDependencies into yours

### Running the build:

The build server should have [node](http://nodejs.org) installed and in `PATH`

On each build:

- `npm install`
- `node_modules/.bin/gulp` from the root of the project

If each command returns 0, the build succeeded, if any command returns non-zero, the build failed.
Once the build is complete, you'll see the following:

- /log: this is a folder of build logs including MSBuild logs and test logs.
  Collect all files in this directory and publish them as build logs
- /dist: these are deployment assets. Deploy these to necessary servers, and/or collect these in
  the build server as deployment assets.

Note: the test project uses git and assumes it is in `PATH`

LICENSE
-------

(MIT License)

Copyright (c) 2013 [Richardson & Sons, LLC](http://richardsonandsons.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
