# Tim's Screeps Code #

Screeps with TypeScript! Uses Rollup to transpile and bundle.

So far, this is just a port of the tutorial code.

## Initializing ##

To start, you must install [Node.js and NPM][node]. I recommend using the
Long Term Support (LTS) release. Installing Node.js will also install NPM.

Once that's done, run this command:

    npm install

You must run this command from the project directory. This will install all
of the project dependencies into `node_modules`, which may take a couple
minutes.

## Building ##

You can build the bundled code with this command:

    npm run build

You must run this command from the project directory. This will create
`dist/main.js` containing the bundled code. It will also create a source map,
but you don't need to worry about that.

## Uploading ##

Before you try uploading any code, you need to create `.screeps.json`
containing some configuration. The file must be located in the project
directory, and should look something like this:

    {
      "main": {
        "token": "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
        "protocol": "https",
        "hostname": "screeps.com",
        "branch": "auto"
      }
    }

You need to replace the token with your actual token, from your account. You
can do this by going to the [Account page][account], clicking "Auth tokens",
and then generating a "Full Access" token.

Once that's done, run this command:

    npm run upload

This will build and upload your code to the official Screeps server.

## Visual Studio Code ##

If you're looking for a text editor suggestion, I would consider [Visual
Studio Code][vscode]. It seems to work really well with TypeScript. If you do
end up using Visual Studio Code, make sure you download the `Clang-Format`
extension (use `Ctrl + Shift + X`). It should automatically pick up the
project settings. Press `Ctrl + Shift + I` to format code.


<!-- References -->

[node]: https://nodejs.org/en/
[account]: https://screeps.com/a/#!/account
[vscode]: https://code.visualstudio.com/


<!-- Local Variables: -->
<!-- fill-column: 77 -->
<!-- End: -->
