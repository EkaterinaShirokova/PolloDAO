import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { MentionsInput, Mention } from 'react-mentions';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import ListItemText from '@material-ui/core/ListItemText';

import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react'

import {
    Editor,
    Transforms,
    Range,
    createEditor,
    Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'


import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import { themeColor } from 'constant'

import { Button, Icon, Toolbar } from './index.js'

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const defaultStyle = {
    control: {
        backgroundColor: "#fff",
        borderRadius: "100px",
        padding: "0px",
        fontWeight: 'bold',
        fontSize: '20px',
    },

    highlighter: {
        overflow: "hidden"
    },

    input: {
        margin: 5
    },

    "&singleLine": {
        control: {
            display: "inline-block",
            width: 130
        },

        highlighter: {
            padding: 1,
            border: "2px inset transparent"
        },

        input: {
            padding: 1,
            border: "2px inset"
        }
    },

    "&multiLine": {
        control: {
            fontFamily: "monospace",

            border: "1px solid silver"
        },

        highlighter: {
            padding: 9
        },

        input: {
            padding: 9,
            minHeight: 20,
            outline: 0,
            border: 0
        }
    },

    suggestions: {
        list: {
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.15)",
            fontSize: 10,
        },

        item: {
            padding: "5px 15px",
            borderBottom: "1px solid rgba(0,0,0,0.15)",

            "&focused": {
                backgroundColor: themeColor
            }
        }
    }
};
  
const defaultMentionStyle = {
    backgroundColor: "#cee4e5"
};

const useStyles = makeStyles(() => ({
   
    container: {
        width: '100%',
        height: '100%',
        paddingTop: '40px',
        backgroundColor: 'white',
        borderRadius: '0px',
    },
    primary: {
        backgroundColor: themeColor,
        color: 'white!important',
        fontWeight: 'bold',
        fontSize: '14px',
        textTransform: 'none',
        paddingTop: '15px',
        paddingBottom: '15px',
        paddingLeft: '30px',
        paddingRight: '30px',
        borderRadius: 100,
        '&:hover': {
            backgroundColor: themeColor,
        },
    },
    tooltip:{
        top: '-9999px',
        left: '-9999px',
        boxShadow: '1px 14px 24px #b4abab59',
        border: '1px solid #8080804a',
        borderRadius: '8px',
        width: 'fit-content',
        height: 'fit-content',
        maxHeight:'200px',
        overflow:'auto',
        zIndex: '99999',
        position: 'absolute',
        background:'white',
        display:'block'
    },
    mention: {
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        zIndex: '9999',
        backgroundColor: 'white',
        maxHeight: '300px',
        overflowY: 'auto',
        minWidth: '100px',
        display: 'block'
    },
    mentionUL: {
        margin: '0px',
        padding: '0px',
        listStyleType: 'none',
        backgroundColor: 'white',
        border: '1px solid rgba(0, 0, 0, 0.15)',
        fontSize: '10px'
    },
    inputs:{
        display:'none'
    },
    liText: {
        display: 'block',
        textAlign: 'center',
        width: '100%',
        padding : '5px 15px',
        textDecoration: 'none',
        color: 'black',
        '&:hover': {
            backgroundColor: themeColor,
        }
    }
}));

const SlateEditor = (props) => {
    const initialValue = [
        {
            type: 'paragraph',
            children: [{ text: props.post? props.post.body : '' }],
        },
    ]
    const [mentionState, setMentionState] = useState({
        value: props.post? props.post.title : '',
        mentions: []
      });
    const [value, setValue] = useState(initialValue)
    const [title, setTitle] = useState(props.post? props.post.title : '' )
    const [file, setFile] = useState(props.post? props.post.file : '' )
    const [filename, setFileName] = useState(props.post? props.post.file : 'Please Upload your file here' )
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withMentions(withHistory(withReact(createEditor()))), [])

    const ref = useRef();
    const [target, setTarget] = useState(null)
    const [index, setIndex] = useState(0)
    const [search, setSearch] = useState('')
    const [curKey, setCurKey] = useState('')
    const [onlyOne, setOnlyOne] = useState(false) ;


    // document.querySelectorAll('.liClick').forEach(item => {
    //     item.addEventListener('touch', event => {
    //       console.log(event)
    //     })
    //   })

      
    const classes = useStyles();
    
    let userIds = ['@all'].concat(props.userids?props.userids:[]);
    let chars = userIds.filter(c =>
        c.toLowerCase().startsWith(search.toLowerCase())
      ).slice(0, 10);

    const availableUserIds = userIds.filter(userId => userId.toLowerCase().startsWith('@'));
    let titleUsers = availableUserIds.map(userId => { return { id: userId, display: userId } });
    
    const handleChange = (event, newValue, newPlainTextValue, mentions) => {
        setTitle(newPlainTextValue);
        setMentionState({ ...mentionState, value: event.target.value });
    };

    const handleInsertMention = (index) => {
        Transforms.select(editor, target)
        insertMention(editor, onlyOne? chars[index].slice(1, chars[index].length):chars[index]);
        setCurKey('');
        setTarget(null)
        ReactEditor.focus(editor);
    }

    const onKeyDown = useCallback(
    event => {
        if (target) {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                const prevIndex = index >= chars.length - 1 ? 0 : index + 1
                setIndex(prevIndex)
                break
            case 'ArrowUp':
                event.preventDefault()
                const nextIndex = index <= 0 ? chars.length - 1 : index - 1
                setIndex(nextIndex)
                break
            case 'Tab':
            case 'Enter':
                event.preventDefault()
                Transforms.select(editor, target)
                insertMention(editor, onlyOne? chars[index].slice(1, chars[index].length):chars[index]);
                setCurKey('');
                setTarget(null)
                break
            case 'Escape':
                event.preventDefault()
                setTarget(null)
                break
            case '@':
                break;
            default:
                setOnlyOne(false);
                break
        }
        }
    },
    [index, search, target]
    )

    

    useEffect(() => {
        if (target && chars.length > 0) {
            const el = ref.current
            const domRange = ReactEditor.toDOMRange(editor, target)
            const rect = domRange.getBoundingClientRect()
            el.style.top = `${rect.top + window.pageYOffset - 45}px`
            el.style.left = `${rect.left + window.pageXOffset + 10}px`
        }
      }, [chars.length, editor, index, search, target])

    
       

    const changeFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name)
    }

    const changeKey = (e) => {
        setCurKey(e.key);
    }
   
    return (
       
        <Container className={classes.container}>
            <Slate editor={editor} value={value} onChange={value => {
                setValue(value)
                const { selection } = editor

                if (selection && Range.isCollapsed(selection)) {
                    const [start] = Range.edges(selection)
                    let wordBefore = Editor.before(editor, start, { unit: 'word' })
                    const before = wordBefore && Editor.before(editor, wordBefore)
                    const beforeRange = before && Editor.range(editor, before, start)
                    const beforeText = beforeRange && Editor.string(editor, beforeRange)
                    const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
                    const after = Editor.after(editor, start)
                    const afterRange = Editor.range(editor, start, after)
                    const afterText = Editor.string(editor, afterRange)
                    const afterMatch = afterText.match(/^(\s|$)/)
                    
                    if (beforeMatch && afterMatch) {
                        setTarget(beforeRange)
                        setSearch('@' + beforeMatch[1])
                        setIndex(0)
                        return
                    }
                    if (curKey === '@') {
                        setTarget(afterRange);
                        setSearch('@')
                        setOnlyOne(true);
                        setIndex(0)
                        return
                    }
                }
                setTarget(null)
            }}>
                <MentionsInput
                    value={mentionState.value}
                    onChange={handleChange}
                    onKeyDown={(event) => { if(event.key === 'Enter') event.preventDefault()}}
                    style={defaultStyle}
                >
                    <Mention
                        markup="[__display__]{__id__}"
                        data={titleUsers}
                        style={defaultMentionStyle}
                    />
                </MentionsInput>
                <div style={{height:'28px'}}></div>
                <Toolbar>
                    <MarkButton format="bold" icon="format_bold" />
                    <MarkButton format="italic" icon="format_italic" />
                    <MarkButton format="underline" icon="format_underlined" />
                    <MarkButton format="code" icon="code" />
                    <BlockButton format="heading-one" icon="looks_one" />
                    <BlockButton format="heading-two" icon="looks_two" />
                    <BlockButton format="block-quote" icon="format_quote" />
                    <BlockButton format="numbered-list" icon="format_list_numbered" />
                    <BlockButton format="bulleted-list" icon="format_list_bulleted" />
                </Toolbar>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some rich text…"
                    spellCheck
                    autoFocus
                    onKeyPress={changeKey}
                    onKeyDown={event => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event)) {
                                event.preventDefault()
                                const mark = HOTKEYS[hotkey]
                                toggleMark(editor, mark)
                            }
                        }
                    }, onKeyDown}
                />
                {/* <MentionsInput
                    value={mentionState.value}
                    onChange={handleChange}
                    onKeyDown={(event) => { if(event.key === 'Enter') event.preventDefault()}}
                    style={contentStyle}
                >
                    <Mention
                        markup="[__display__]{__id__}"
                        data={titleUsers}
                        style={contentMentionStyle}
                    />
                </MentionsInput> */}
                <div style={{height:'40px'}}></div>
                <div style={{position: "relative"}}>
                <input
                    
                    className={classes.inputs}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={changeFile}
                />
                <label htmlFor="contained-button-file">
                    
                <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    
                 ><CloudUploadIcon />
                </Button>
                <span style={{position: "absolute", paddingLeft:'10px', top:'4px'}}>{filename}</span>
                </label>
                </div>
            </Slate>
            <Divider style={{ marginBottom: '30px' }} />
            <Container style={{ display: 'flex', justifyContent: 'flex-end', }}>
                <Button className={classes.primary} onClick={() => props.onSubmit(title, value, file)}>Save</Button>
            </Container>
            {/* <div className={classes.tooltip} ref={ref}> */}
            {/* {target && chars.length > 0? <List dense={true}>
                {chars.map((char, i) => (
                    <ListItem key={char} className={classes.liuser} selected={i === index} style={{cursor: 'pointer'}} onClick={handleInsertMention}>
                    <ListItemIcon style={{minWidth:'34px'}}>
                        <AccountCircleIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={char}
                    />
                    </ListItem>
                ))}
            </List>:''} */}
            {/* </div> */}
            {target && chars.length > 0 && (
                <div className={classes.mention} ref={ref}>
                <ul className={classes.mentionUL}>
                    {chars.map((char, i) => (
                    <li
                       className="liuser"
                        key={char}
                        // onClick={handleLiClick("hellio")}
                        selected = {i === index}
                        style={{
                        background: i === index ? themeColor : 'transparent',
                        cursor: 'pointer',
                        padding: '0px',
                        borderBottom: '1px solid rgba(0,0,0, 0.15)'
                        }}
                    >
                        <a href="#" className={classes.liText} onClick={() => handleInsertMention(i)}>{char}</a>
                    </li>
                    ))}
                </ul>
                </div>
            )}
        </Container>
    )
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            LIST_TYPES.includes(
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
            ),
        split: true,
    })
    const newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

const MarkButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}


const withMentions = editor => {
    const { isInline, isVoid } = editor
  
    editor.isInline = element => {
      return element.type === 'mention' ? true : isInline(element)
    }
  
    editor.isVoid = element => {
      return element.type === 'mention' ? true : isVoid(element)
    }
  
    return editor
}
  
const insertMention = (editor, character) => {
    const mention = {
      text: character,
    }
    Transforms.insertNodes(editor, mention)
    Transforms.move(editor)
}

export default SlateEditor