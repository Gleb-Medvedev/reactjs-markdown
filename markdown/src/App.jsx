import React, { useState, useRef, useEffect } from 'react';
import { EditorBlock, EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { Select, MenuItem, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';

// import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
// import {
//   ItalicButton,
//   BoldButton,
//   UnderlineButton,
// } from 'draft-js-buttons';

// import 'draft-js/dist/Draft.css';
// import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

// const inlineToolbarPlugin = createInlineToolbarPlugin();
// const { InlineToolbar } = inlineToolbarPlugin;
// const plugins = [inlineToolbarPlugin];

export default function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editor = useRef(null);

  const getCurrentBlock = () => { //функция получения блока (его id, который мы сами НЕ используем), на котором в текущий момент находится курсор
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    return content.getBlockForKey(selection.getStartKey());
  };

  const currentStyle = editorState.getCurrentInlineStyle(); //style для inline элементов
  const currentBlockType = getCurrentBlock().getType();; //type для блочных элементов


  // const selection = editorState.getSelection();
  // const content = editorState.getCurrentContent();
  // const block = content.getBlockForKey(selection.getStartKey()); //получаем id блока (не строчных элементов)

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };


  const BUTTON_INLINE_STYLES = [
    {
      label: 'Жирный текст',
      style: 'BOLD',
      icon: <FormatBoldIcon />,
    },
    {
      label: 'Курсив',
      style: 'ITALIC',
      icon: <FormatItalicIcon />,
    },
    {
      label: 'Подчёркнутый текст',
      style: 'UNDERLINE',
      icon: <FormatUnderlinedIcon />,
    },
    {
      label: 'Зачеркнутый текст',
      style: 'STRIKETHROUGH',
      icon: <FormatStrikethroughIcon />
    },
    {
      label: 'Нумерованный список',
      type: 'ordered-list-item',
      icon: <FormatListNumberedIcon />
    },
    {
      label: 'Ненумерованный список',
      type: 'unordered-list-item',
      icon: <FormatListBulletedIcon />
    },
    {
      label: 'Список заголовков',
      selectOptions: [
        {
          optionTitle: 'Заголовок 1',
          selectType: 'header-one'
        },
        {
          optionTitle: 'Заголовок 2',
          selectType: 'header-two'
        },
        {
          optionTitle: 'Заголовок 3',
          selectType: 'header-three'
        },
        {
          optionTitle: 'Заголовок 4',
          selectType: 'header-four'
        },
        {
          optionTitle: 'Заголовок 5',
          selectType: 'header-five'
        },
        {
          optionTitle: 'Заголовок 6',
          selectType: 'header-six'
        },
      ]
    },
    {
      label: 'Увеличить отступ',
      action: 'increase-indent',
      icon: <FormatIndentIncreaseIcon />
    },
    {
      label: 'Уменьшить отступ',
      action: 'decrease-indent',
      icon: <FormatIndentDecreaseIcon />
    },
  ];

  //функция для работы с inline элементами (форматирование текста)
  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    setTimeout(() => {
      editor.current?.focus();
    }, 0);
  };

    //функция для работы с block элементами (добавление блочных элементов)
  const toggleBlockType = (type) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
    setTimeout(() => {
      editor.current?.focus();
    }, 0);
  };

    //функция для работы с actions элементами (экшены добавления отступов)
  // const handleIndentAction = (action) => {
  //   const targetedBlock = getCurrentBlock();
  //   const targetedBlockDepth = targetedBlock.getDepth();

  //   let newDepth = targetedBlockDepth;

  //   if (action === 'increase-indent' && currentDepth < 4) {
  //     newDepth = currentDepth + 1;
  //   }
  //   if (action === 'decrease-indent' && currentDepth > 0) {
  //     newDepth = currentDepth - 1;
  //   }

  //   const newBlock = block.set('depth', newDepth);
  //   const content = editorState.getCurrentContent();
  //   const blockMap = content.getBlockMap();
  //   const newBlockMap = blockMap.set(block.getKey(), newBlock);
  // }

  window.addEventListener('click', () => {
    console.log(getCurrentBlock().getDepth())
  })

  const handleIndentAction = (action) => {
    // console.log('check')
    const block = getCurrentBlock(); // получаем текущий блок

    // console.log(block)
    const currentDepth = block.getDepth(); // его текущий отступ
    let newDepth = currentDepth;

    // console.log(newDepth)
  
    // определяем новый отступ в зависимости от действия
    if (action === 'increase-indent' && currentDepth < 4) {
      newDepth = currentDepth + 1;
    } else if (action === 'decrease-indent' && currentDepth > 0) {
      newDepth = currentDepth - 1;
    } else {
      return; // ничего не меняем — выходим
    }
  
    // создаём новый блок с обновлённым depth
    const newBlock = block.set('depth', newDepth);
  
    // получаем текущий content и blockMap
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
  
    // заменяем старый блок на новый
    const newBlockMap = blockMap.set(block.getKey(), newBlock);
  
    // создаём новый ContentState
    const newContentState = content.merge({
      blockMap: newBlockMap,
      selectionAfter: editorState.getSelection(), // добавляем это!
    });
  
    // пушим новый ContentState в EditorState
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'adjust-depth'
    );
  
    // обновляем состояние редактора
    setEditorState(newEditorState);
  };

  return (
    <>
      <div style={{ marginBottom: 10, padding: '15px', display: 'flex', alignItems: 'center' }}>
      {
        BUTTON_INLINE_STYLES.map((btnConfig) => {

          const isActive = btnConfig.style
          ? currentStyle.has(btnConfig.style)
          : currentBlockType === btnConfig.type;

          return (
            !btnConfig.selectOptions ? (
              <IconButton
                key={btnConfig.label}
                title={isActive ? `Выключить ${btnConfig.label}` : `Включить ${btnConfig.label}`}
                sx={{
                  padding: '6px',
                  marginRight: '6px',
                  borderRadius: '50%',
                  border: isActive ? '2px solid #4caf50' : '2px solid rgba(128, 128, 128, 0.5)',
                  backgroundColor: isActive ? '#e8f5e9' : 'transparent',
                  transition: 'all 0.2s ease-in-out',
                }}
                color={isActive ? 'success' : 'default'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (btnConfig.style) {
                    toggleInlineStyle(btnConfig.style)
                  } else if (btnConfig.type) {
                    toggleBlockType(btnConfig.type)
                  } else if (btnConfig.action) {
                    handleIndentAction(btnConfig.action)
                  };
                  //   ? toggleInlineStyle(btnConfig.style)
                  // : toggleBlockType(btnConfig.type);
              }}
            >
              {btnConfig.icon}
            </IconButton>
            ) : (
              <Select
                key={btnConfig.label}
                value={currentBlockType}
                displayEmpty
                onChange={(e) => {
                  toggleBlockType(e.target.value);
                }}
                size="small"
                sx={{ minWidth: 160, marginRight: '6px' }}
                color={isActive ? 'success' : 'default'}
                title={btnConfig.label}
              >
                {btnConfig.selectOptions.map((option, index) => (
                  <MenuItem value={option.selectType} key={option.optionTitle}>
                    <Typography
                      variant={`h${option.optionTitle.slice(-1)}`}
                      sx={{
                        fontSize: `${21 - (index + 2)}px`
                      }}
                    >
                      {option.optionTitle}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            )
          );
        })
      }
      </div>

    <div style={{ padding: '15px', border: '2px solid rgba(128, 128, 128, 0.5)', borderRadius: '16px', minHeight: '75px'}}>      
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        ref={editor}
        handleKeyCommand={handleKeyCommand}
        style={{height: '100%'}}
      />
    </div>
    </>
  );
}