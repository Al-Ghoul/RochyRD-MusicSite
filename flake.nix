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

  outputs = { nixpkgs, devenv, ... } @ inputs:
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
    };
}
