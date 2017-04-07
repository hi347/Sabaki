const {ipcRenderer, shell, clipboard} = require('electron')

const sabaki = typeof window !== 'undefined' ? window.sabaki : {}
const dialog = require('../modules/dialog')
const gametree = require('../modules/gametree')
const helper = require('../modules/helper')
const setting = require('../modules/setting')

let toggleSetting = key => setting.set(key, !setting.get(key))
let selectTool = tool => (sabaki.setMode('edit'), sabaki.setState({selectedTool: tool}))

let data = [
    {
        label: '&File',
        submenu: [
            {
                label: '&New',
                accelerator: 'CmdOrCtrl+N',
                click: () => sabaki.newFile({playSound: true, showInfo: true})
            },
            {
                label: 'New &Window',
                accelerator: 'CmdOrCtrl+Shift+N',
                click: () => ipcRenderer.send('new-window')
            },
            {type: 'separator'},
            {
                label: '&Open…',
                accelerator: 'CmdOrCtrl+O',
                click: () => sabaki.loadFile()
            },
            {
                label: '&Save',
                accelerator: 'CmdOrCtrl+S',
                click: () => sabaki.saveFile(sabaki.state.representedFilename)
            },
            {
                label: 'Sa&ve As…',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => sabaki.saveFile()
            },
            {type: 'separator'},
            {
                label: 'Load from &Clipboard',
                click: () => sabaki.loadContent(clipboard.readText(), 'sgf', {ignoreEncoding: true})
            },
            {
                label: 'Copy &to Clipboard',
                click: () => clipboard.writeText(sabaki.getSGF())
            },
            {
                label: 'Copy &ASCII Diagram',
                click: () => clipboard.writeText(gametree.getBoard(...sabaki.state.treePosition).generateAscii())
            },
            {type: 'separator'},
            {
                label: 'Game &Info',
                accelerator: 'CmdOrCtrl+I',
                click: () => sabaki.openDrawer('info')
            },
            {
                label: '&Manage Games…',
                accelerator: 'CmdOrCtrl+Shift+M',
                click: () => sabaki.openDrawer('gamechooser')
            },
            {type: 'separator'},
            {
                label: '&Preferences…',
                accelerator: 'CmdOrCtrl+,',
                click: () => sabaki.openDrawer('preferences')
            }
        ]
    },
    {
        label: '&Play',
        submenu: [
            {
                label: '&Toggle Player',
                click: () => sabaki.setPlayer(...sabaki.state.treePosition, -sabaki.getPlayer(...sabaki.state.treePosition))
            },
            {type: 'separator'},
            {
                label: '&Select Point',
                accelerator: 'CmdOrCtrl+L',
                click: () => dialog.showInputBox('Enter a coordinate to select a point', ({value}) => {
                    sabaki.clickVertex(value)
                })
            },
            {
                label: '&Pass',
                accelerator: 'CmdOrCtrl+P',
                click: () => sabaki.makeMove([-1, -1])
            },
            {
                label: '&Resign',
                click: () => sabaki.makeResign()
            },
            {type: 'separator'},
            {
                label: '&Estimate',
                click: () => sabaki.setMode('estimator')
            },
            {
                label: 'Sc&ore',
                click: () => sabaki.setMode('scoring')
            }
        ]
    },
    {
        label: '&Edit',
        submenu: [
            {
                label: 'Toggle &Edit Mode',
                accelerator: 'CmdOrCtrl+E',
                click: () => sabaki.setMode(sabaki.state.mode === 'edit' ? 'play' : 'edit')
            },
            {
                label: 'Clean &Markup…',
                click: () => sabaki.openDrawer('cleanmarkup')
            },
            {
                label: '&Select Tool',
                submenu: [
                    {
                        label: '&Stone Tool',
                        accelerator: 'CmdOrCtrl+1',
                        click: () => selectTool('stone_1')
                    },
                    {
                        label: '&Cross Tool',
                        accelerator: 'CmdOrCtrl+2',
                        click: () => selectTool('cross')
                    },
                    {
                        label: '&Triangle Tool',
                        accelerator: 'CmdOrCtrl+3',
                        click: () => selectTool('triangle')
                    },
                    {
                        label: 'S&quare Tool',
                        accelerator: 'CmdOrCtrl+4',
                        click: () => selectTool('square')
                    },
                    {
                        label: 'C&ircle Tool',
                        accelerator: 'CmdOrCtrl+5',
                        click: () => selectTool('circle')
                    },
                    {
                        label: '&Line Tool',
                        accelerator: 'CmdOrCtrl+6',
                        click: () => selectTool('line')
                    },
                    {
                        label: '&Arrow Tool',
                        accelerator: 'CmdOrCtrl+7',
                        click: () => selectTool('arrow')
                    },
                    {
                        label: 'La&bel Tool',
                        accelerator: 'CmdOrCtrl+8',
                        click: () => selectTool('label')
                    },
                    {
                        label: '&Number Tool',
                        accelerator: 'CmdOrCtrl+9',
                        click: () => selectTool('number')
                    }
                ]
            },
            {type: 'separator'},
            {
                label: '&Copy Variation',
                click: () => sabaki.copyVariation(...sabaki.state.treePosition)
            },
            {
                label: 'Cu&t Variation',
                click: () => sabaki.cutVariation(...sabaki.state.treePosition)
            },
            {
                label: '&Paste Variation',
                click: () => sabaki.pasteVariation(...sabaki.state.treePosition)
            },
            {type: 'separator'},
            {
                label: 'Make Main &Variation',
                click: () => sabaki.makeMainVariation(...sabaki.state.treePosition)
            },
            {
                label: 'Shift &Left',
                click: () => sabaki.shiftVariation(...sabaki.state.treePosition, -1)
            },
            {
                label: 'Shift Ri&ght',
                click: () => sabaki.shiftVariation(...sabaki.state.treePosition, 1)
            },
            {type: 'separator'},
            {
                label: '&Flatten',
                click: () => sabaki.flattenVariation(...sabaki.state.treePosition)
            },
            {
                label: '&Remove Node',
                accelerator: 'CmdOrCtrl+Delete',
                click: () => sabaki.removeNode(...sabaki.state.treePosition)
            },
            {
                label: 'Remove &Other Variations',
                click: () => sabaki.removeOtherVariations(...sabaki.state.treePosition)
            }
        ]
    },
    {
        label: 'Fin&d',
        submenu: [
            {
                label: 'Toggle &Find Mode',
                accelerator: 'CmdOrCtrl+F',
                click: () => sabaki.setMode(sabaki.state.mode === 'find' ? 'play' : 'find'),
            },
            {
                label: 'Find &Next',
                accelerator: 'F3',
                click: () => (sabaki.setMode('find'), sabaki.findMove(1, {
                    vertex: sabaki.state.findVertex,
                    text: sabaki.state.findText
                }))
            },
            {
                label: 'Find &Previous',
                accelerator: 'Shift+F3',
                click: () => (sabaki.setMode('find'), sabaki.findMove(-1, {
                    vertex: sabaki.state.findVertex,
                    text: sabaki.state.findText
                }))
            },
            {type: 'separator'},
            {
                label: 'Toggle &Hotspot',
                accelerator: 'CmdOrCtrl+B',
                click: () => sabaki.setComment(...sabaki.state.treePosition, {
                    hotspot: !('HO' in sabaki.state.treePosition[0].nodes[sabaki.state.treePosition[1]])
                })
            },
            {
                label: 'Jump to Ne&xt Hotspot',
                accelerator: 'F2',
                click: () => sabaki.findHotspot(1),
            },
            {
                label: 'Jump to Pre&vious Hotspot',
                accelerator: 'Shift+F2',
                click: () => sabaki.findHotspot(-1),
            }
        ]
    },
    {
        label: '&Navigation',
        submenu: [
            {
                label: '&Back',
                accelerator: 'Up',
                click: () => sabaki.goStep(-1)
            },
            {
                label: '&Forward',
                accelerator: 'Down',
                click: () => sabaki.goStep(1)
            },
            {type: 'separator'},
            {
                label: 'Go to &Previous Fork',
                accelerator: 'CmdOrCtrl+Up',
                click: () => sabaki.goToPreviousFork()
            },
            {
                label: 'Go to &Next Fork',
                accelerator: 'CmdOrCtrl+Down',
                click: () => sabaki.goToNextFork()
            },
            {type: 'separator'},
            {
                label: 'Go to Previous Commen&t',
                accelerator: 'CmdOrCtrl+Shift+Up',
                click: () => sabaki.goToComment(-1)
            },
            {
                label: 'Go to Next &Comment',
                accelerator: 'CmdOrCtrl+Shift+Down',
                click: () => sabaki.goToComment(1)
            },
            {type: 'separator'},
            {
                label: 'Go to Be&ginning',
                accelerator: 'Home',
                click: () => sabaki.goToBeginning()
            },
            {
                label: 'Go to &End',
                accelerator: 'End',
                click: () => sabaki.goToEnd()
            },
            {type: 'separator'},
            {
                label: 'Go to &Main Variation',
                accelerator: 'CmdOrCtrl+Left',
                click: () => sabaki.goToMainVariation()
            },
            {
                label: 'Go to Previous &Variation',
                accelerator: 'Left',
                click: () => sabaki.goToSiblingVariation(-1)
            },
            {
                label: 'Go to Next Va&riation',
                accelerator: 'Right',
                click: () => sabaki.goToSiblingVariation(1)
            },
            {type: 'separator'},
            {
                label: 'Go to Move N&umber',
                accelerator: 'CmdOrCtrl+G',
                click: () => dialog.showInputBox('Enter a move number to go to', ({value}) => {
                    sabaki.closeDrawers()
                    sabaki.goToMoveNumber(value)
                })
            }
        ]
    },
    {
        label: 'Eng&ines',
        submenu: [
            {
                label: '&Detach',
                click: () => sabaki.detachEngines()
            },
            {
                label: 'Manage &Engines…',
                click: () => (sabaki.setState({preferencesTab: 'engines'}), sabaki.openDrawer('preferences'))
            },
            {type: 'separator'},
            {
                label: 'Generate &Move',
                accelerator: 'F5',
                click: () => sabaki.startGeneratingMoves()
            },
            {type: 'separator'},
            {
                label: 'Toggle &GTP Console',
                click: () => toggleSetting('view.show_leftsidebar')
            },
            {
                label: '&Clear Console',
                click: () => sabaki.setState({consoleLog: []})
            }
        ]
    },
    {
        label: '&View',
        submenu: [
            {
                label: 'Toggle Auto&play Mode',
                click: () => sabaki.setMode(sabaki.state.mode === 'autoplay' ? 'play' : 'autoplay')
            },
            {
                label: 'Toggle G&uess Mode',
                click: () => sabaki.setMode(sabaki.state.mode === 'guess' ? 'play' : 'guess')
            },
            {
                label: 'Toggle &Full Screen',
                accelerator: 'CmdOrCtrl+Shift+F',
                click: () => sabaki.setState(({fullScreen}) => ({fullScreen: !fullScreen}))
            },
            {type: 'separator'},
            {
                label: 'Show &Coordinates',
                accelerator: 'CmdOrCtrl+Shift+C',
                checked: 'view.show_coordinates',
                click: () => toggleSetting('view.show_coordinates')
            },
            {
                label: 'Show Move Colori&zation',
                checked: 'view.show_move_colorization',
                click: () => toggleSetting('view.show_move_colorization')
            },
            {
                label: 'Show &Next Moves',
                checked: 'view.show_next_moves',
                click: () => toggleSetting('view.show_next_moves')
            },
            {
                label: 'Show &Sibling Variations',
                checked: 'view.show_siblings',
                click: () => toggleSetting('view.show_siblings')
            },
            {type: 'separator'},
            {
                label: 'Show Game &Tree',
                checked: 'view.show_graph',
                accelerator: 'CmdOrCtrl+T',
                click: () => toggleSetting('view.show_graph')
            },
            {
                label: 'Show Co&mments',
                checked: 'view.show_comments',
                accelerator: 'CmdOrCtrl+Shift+T',
                click: () => toggleSetting('view.show_comments')
            }
        ]
    },
    {
        label: '&Help',
        submenu: [
            {
                label: '{name} v{version}',
                enabled: false
            },
            {
                label: 'Check for &Updates',
                click: () => ipcRenderer.send('check-for-updates', true)
            },
            {type: 'separator'},
            {
                label: 'GitHub &Respository',
                click: () => shell.openExternal(`https://github.com/yishn/${sabaki.appName}`)
            },
            {
                label: 'Report &Issue',
                click: () => shell.openExternal(`https://github.com/yishn/${sabaki.appName}/issues`)
            }
        ]
    }
]

let generateIds = (menu, idPrefix = '') => {
    menu.forEach((item, i) => {
        item.id = idPrefix + i

        if ('submenu' in item) {
            generateIds(item.submenu, `${item.id}-`)
        }
    })
}

generateIds(data)

module.exports = exports = data

exports.clone = function() {
    return helper.clone(data)
}