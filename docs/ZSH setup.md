# ZSH setup

If you are using a DIT-issued device, you will need to set up ZSH before you can run the project natively. You will only need to complete this process once.

Prerequisites:
- [Homebrew](https://brew.sh)
- [NodeJS](https://nodejs.org/en/download/)

1. Run `nano ~/.zshrc`, which will create and open your ZSH config file. Close this file as you do not need to add anything at this stage.

2. Run `brew install nvm` to setup Node.

3. Open your ZSH config file using the command from step one. If the file is empty, copy the code below into it and close the file.

```bash
export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

After closing the file, follow the native readme from the beginning.
