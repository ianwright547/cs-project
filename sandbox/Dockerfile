FROM node:24-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends bash git python3 nano vim-tiny less procps findutils diffutils coreutils grep sed ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --uid 1001 --create-home --shell /bin/bash learner
COPY seed.py snapshot.py files.py bashrc /opt/practice/
RUN chmod -R a=rX /opt/practice
USER 1001:1001
WORKDIR /workspace
ENV HOME=/home/learner TERM=xterm-256color LANG=C.UTF-8 GIT_CONFIG_NOSYSTEM=1
CMD ["sleep", "infinity"]
