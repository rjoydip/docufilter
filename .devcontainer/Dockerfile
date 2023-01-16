# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.222.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="18"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# Cypress Dependencies - https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies
RUN apt-get update \
    && apt-get install -y dbus libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

RUN mkdir -p /var/run/dbus
RUN dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address

# [Optional] Uncomment if you want to install more global node modules
RUN su node -c "npm install -g pnpm"
