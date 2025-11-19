(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Esta extensión debe ejecutarse sin sandbox');
  }

  class AdvancedTimer {
    constructor() {
      this.timers = {};
      this.defaultTimer = {
        startTime: 0,
        pausedTime: 0,
        isRunning: false,
        isPaused: false
      };
    }

    getInfo() {
      return {
        id: 'advancedtimer',
        name: 'Cronómetro Avanzado',
        color1: '#FF6680',
        color2: '#FF4D6A',
        color3: '#FF3355',
        blocks: [
          {
            opcode: 'startTimer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'iniciar cronómetro [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          {
            opcode: 'pauseTimer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'pausar cronómetro [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          {
            opcode: 'resumeTimer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reanudar cronómetro [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          {
            opcode: 'stopTimer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'detener cronómetro [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          {
            opcode: 'resetTimer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reiniciar cronómetro [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          '---',
          {
            opcode: 'getTimeSeconds',
            blockType: Scratch.BlockType.REPORTER,
            text: 'segundos transcurridos [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          {
            opcode: 'getTimeFormatted',
            blockType: Scratch.BlockType.REPORTER,
            text: '[NAME] formato [FORMAT]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              },
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'formatMenu',
                defaultValue: 'MM:SS'
              }
            }
          },
          {
            opcode: 'getMinutes',
            blockType: Scratch.BlockType.REPORTER,
            text: 'minutos de [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          {
            opcode: 'getSecondsOnly',
            blockType: Scratch.BlockType.REPORTER,
            text: 'segundos (0-59) de [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          '---',
          {
            opcode: 'isRunning',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '¿[NAME] corriendo?',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          {
            opcode: 'isPaused',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '¿[NAME] pausado?',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          },
          '---',
          {
            opcode: 'setTime',
            blockType: Scratch.BlockType.COMMAND,
            text: 'establecer [NAME] a [TIME] segundos',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              },
              TIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'addTime',
            blockType: Scratch.BlockType.COMMAND,
            text: 'añadir [TIME] segundos a [NAME]',
            arguments: {
              TIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'principal'
              }
            }
          }
        ],
        menus: {
          formatMenu: {
            acceptReporters: false,
            items: ['MM:SS', 'HH:MM:SS', 'M:SS', 'SS']
          }
        }
      };
    }

    _getTimer(name) {
      if (!this.timers[name]) {
        this.timers[name] = { ...this.defaultTimer };
      }
      return this.timers[name];
    }

    _getCurrentTime(timer) {
      if (!timer.isRunning) return timer.pausedTime;
      if (timer.isPaused) return timer.pausedTime;
      return (Date.now() - timer.startTime) / 1000;
    }

    startTimer(args) {
      const timer = this._getTimer(args.NAME);
      timer.startTime = Date.now();
      timer.pausedTime = 0;
      timer.isRunning = true;
      timer.isPaused = false;
    }

    pauseTimer(args) {
      const timer = this._getTimer(args.NAME);
      if (timer.isRunning && !timer.isPaused) {
        timer.pausedTime = this._getCurrentTime(timer);
        timer.isPaused = true;
      }
    }

    resumeTimer(args) {
      const timer = this._getTimer(args.NAME);
      if (timer.isPaused) {
        timer.startTime = Date.now() - (timer.pausedTime * 1000);
        timer.isPaused = false;
      }
    }

    stopTimer(args) {
      const timer = this._getTimer(args.NAME);
      timer.pausedTime = this._getCurrentTime(timer);
      timer.isRunning = false;
      timer.isPaused = false;
    }

    resetTimer(args) {
      const timer = this._getTimer(args.NAME);
      timer.startTime = Date.now();
      timer.pausedTime = 0;
      timer.isRunning = false;
      timer.isPaused = false;
    }

    getTimeSeconds(args) {
      const timer = this._getTimer(args.NAME);
      const time = this._getCurrentTime(timer);
      // Retorna el número entero de segundos totales
      return Math.floor(time);
    }

    getMinutes(args) {
      const timer = this._getTimer(args.NAME);
      const totalSeconds = this._getCurrentTime(timer);
      return Math.floor(totalSeconds / 60);
    }

    getSecondsOnly(args) {
      const timer = this._getTimer(args.NAME);
      const totalSeconds = this._getCurrentTime(timer);
      return Math.floor(totalSeconds % 60);
    }

    getTimeFormatted(args) {
      const timer = this._getTimer(args.NAME);
      const totalSeconds = this._getCurrentTime(timer);
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      const pad = (num, size = 2) => String(num).padStart(size, '0');

      switch(args.FORMAT) {
        case 'SS':
          return String(Math.floor(totalSeconds));
        case 'M:SS':
          return `${minutes}:${pad(seconds)}`;
        case 'MM:SS':
          return `${pad(minutes)}:${pad(seconds)}`;
        case 'HH:MM:SS':
          return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        default:
          return `${pad(minutes)}:${pad(seconds)}`;
      }
    }

    isRunning(args) {
      const timer = this._getTimer(args.NAME);
      return timer.isRunning && !timer.isPaused;
    }

    isPaused(args) {
      const timer = this._getTimer(args.NAME);
      return timer.isPaused;
    }

    setTime(args) {
      const timer = this._getTimer(args.NAME);
      const time = Scratch.Cast.toNumber(args.TIME);
      timer.pausedTime = time;
      if (timer.isRunning && !timer.isPaused) {
        timer.startTime = Date.now() - (time * 1000);
      }
    }

    addTime(args) {
      const timer = this._getTimer(args.NAME);
      const timeToAdd = Scratch.Cast.toNumber(args.TIME);
      const currentTime = this._getCurrentTime(timer);
      this.setTime({ NAME: args.NAME, TIME: currentTime + timeToAdd });
    }
  }

  Scratch.extensions.register(new AdvancedTimer());
})(Scratch);
