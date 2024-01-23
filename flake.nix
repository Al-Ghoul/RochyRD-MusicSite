{
  description = "NextJS development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv/9ba9e3b908a12ddc6c43f88c52f2bf3c1d1e82c1";
    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { nixpkgs, devenv, self, ... } @ inputs:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells."${system}".default = with pkgs; devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          ({ ... }: {

            packages = [
              nodejs # For neovim's LSP (Remove it if you're not using neovim)
              yarn
              firefox-devedition
              nodePackages.dotenv-cli
              firebase-tools
              jdk
            ];

            pre-commit.hooks = {
              deadnix.enable = true;
              nixpkgs-fmt.enable = true;
              denofmt.enable = true;
              denolint.enable = true;
            };

          })
        ];
      };

      hydraJobs = rec {
        build =
          with pkgs; mkYarnPackage {
            name = "Site-build";
            src = self;
            version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
            __noChroot = true;

            nativeBuildInputs = [
              fixup_yarn_lock
              yarn
              nodejs
              cacert
              nodePackages.dotenv-cli
              firebase-tools
              jdk
            ];

            offlineCache = fetchYarnDeps {
              yarnLock = self + "/yarn.lock";
              hash = "sha256-X6QeyMqErR24ZTzSkjOeA3X4s6yCrF4f3U6WWs1nZD4=";
            };

            configurePhase = ''
              export HOME=$(mktemp -d)
              fixup_yarn_lock yarn.lock
              yarn config --offline set yarn-offline-mirror $offlineCache
              yarn install --offline --frozen-lockfile --ignore-scripts --no-progress --non-interactive
              patchShebangs node_modules/
            '';

            buildPhase = ''
              runHook preBuild
              dotenv -v FIREBASE_SERVICE_ACCOUNT_KEY="ignoreIt" yarn --offline build
              runHook postBuild
            '';


            installPhase = ''
              runHook preInstall
              mkdir $out
              mv {.,}* $out
              runHook postInstall
            '';

            doDist = false;
            doCheck = false;
            dontFixup = true;

            passthru.tests.lint = runCommand "run-lint" { buildInputs = [ yarn ]; }
              ''
                export HOME=$(mktemp -d)
                cp -r ${build}/{.,}* .
                yarn lint
                touch $out
              '';


            passthru.tests.firestore-rules = runCommand "run-firestore-rules-tests"
              {
                __noChroot = true;
                buildInputs = [
                  firebase-tools
                  jdk
                  yarn
                  cacert
                ];
              }
              ''
                export HOME=$(mktemp -d)
                  cp -r ${build}/{.,}* .
                  firebase emulators:exec "yarn test"
                  touch $out
              '';
          };

        tests = build.tests;
      };
    };
}
