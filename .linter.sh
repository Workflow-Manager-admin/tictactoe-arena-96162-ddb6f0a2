#!/bin/bash
cd /home/kavia/workspace/code-generation/tictactoe-arena-96162-ddb6f0a2/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

