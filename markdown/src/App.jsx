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
import TableChartIcon from '@mui/icons-material/TableChart';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import { stateToMarkdown } from 'draft-js-export-markdown'; //для экспорта разметки
import './App.css'

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

  const contentState = editorState.getCurrentContent(); //для экспорта разметки. Получаем весь текущий контент редактора

  // const markdown = stateToMarkdown(contentState); //для экспорта разметки. В заимпортированную функцию параметром передаём наш весь текущий контент
  // console.log(markdown); //весь текст редактора с Markdown разметкой
  // console.log(editorState.getCurrentContent().getPlainText()) //неформатированный текст (без Markdown)


  // попытка в кастомную функцию для получения текста с Markdown разметкой.
  //Нужна т.к. ИЗ КОРОБКИ либа не поддерживает добавление отступов для inline элементов,
  //По факту css отступы, сделанные паддингом, конвертятся в пробелы этой функцией
  const exportToMarkdownWithIndent = () => {
    const contentState = editorState.getCurrentContent();
  
    let markdown = stateToMarkdown(contentState);
    const blocks = contentState.getBlocksAsArray();
  
    const lines = markdown.split('\n');
  
    const indentedMarkdown = lines.map((line, index) => {
      const block = blocks[index];
      if (!block) return line;
  
      const depth = block.getDepth();
      const type = block.getType();
      const isTextOrHeader = type === 'unstyled' || type.startsWith('header');
  
      if (isTextOrHeader && depth > 0) {
        const indent = '  '.repeat(depth); // 2 пробела на каждый уровень
        return indent + line;
      }
  
      return line;
    }).join('\n');
  
    return indentedMarkdown;
  };
  

  // console.log(exportToMarkdownWithIndent())

  //функция для разметки комбинациями клавиш
  // const handleKeyCommand = (command, state) => {
  //   const newState = RichUtils.handleKeyCommand(state, command);
  //   if (newState) {
  //     setEditorState(newState);
  //     return 'handled';
  //   }
  //   return 'not-handled';
  // };
  
  //массив кнопок тулбара с конфигом
  const BUTTON_INLINE_STYLES = [
    {
      label: 'Жирный текст',
      action: 'style',
      actionValue: 'BOLD',
      icon: <FormatBoldIcon />,
    },
    {
      label: 'Курсив',
      action: 'style',
      actionValue: 'ITALIC',
      icon: <FormatItalicIcon />,
    },
    {
      label: 'Подчёркнутый текст',
      action: 'style',
      actionValue: 'UNDERLINE',
      icon: <FormatUnderlinedIcon />,
    },
    {
      label: 'Зачеркнутый текст',
      action: 'style',
      actionValue: 'STRIKETHROUGH',
      icon: <FormatStrikethroughIcon />
    },
    {
      label: 'Нумерованный список',
      action: 'type',
      actionValue: 'ordered-list-item',
      icon: <FormatListNumberedIcon />
    },
    {
      label: 'Ненумерованный список',
      action: 'type',
      actionValue: 'unordered-list-item',
      icon: <FormatListBulletedIcon />
    },
    {
      label: 'Список заголовков',
      selectOptions: [
        {
          optionTitle: 'Обычный',
          selectType: 'unstyled'
        },
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
      label: 'Уменьшить отступ',
      action: 'action',
      actionValue: 'decrease-indent',
      icon: <FormatIndentDecreaseIcon />
    },
    {
      label: 'Увеличить отступ',
      action: 'action',
      actionValue: 'increase-indent',
      icon: <FormatIndentIncreaseIcon />
    },
    // {
    //   label: 'Добавить таблицу',
    //   icon: <TableChartIcon/>
    // },
    {
      label: 'Выравнивание по левому краю',
      action: 'alignment',
      actionValue: 'left',
      icon: <AlignHorizontalLeftIcon />
    },
    {
      label: 'Выравнивание по центру',
      action: 'alignment',
      actionValue: 'center',
      icon: <FormatAlignCenterIcon />
    },
    {
      label: 'Выравнивание по правому краю',
      action: 'alignment',
      actionValue: 'right',
      icon: <AlignHorizontalRightIcon />
    },
  ];

  //функция для работы с Заголовками из Select
  const toggleSelectHeadings = (type) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
    setTimeout(() => {
      editor.current?.focus();
    }, 0);
  };

  //функция для отступов и выравнивания текста
  const blockStyleFn = (block) => {
    const depth = block.getDepth();
    const alignment = block.getData().get('text-align');
    let className = `block-depth-${depth}`;
    if (alignment) {
      className += ` align-${alignment}`;
    }
    return className;
  };

  //функция для выравнивания текста в конкретной строке
  function applyBlockAlignment(editorState, alignment) {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const key = selection.getStartKey();
    const block = content.getBlockForKey(key);
  
    const newBlockData = block.getData().set('text-align', alignment);
  
    const newContentState = content.merge({
      blockMap: content.getBlockMap().set(key, block.set('data', newBlockData)),
    });
  
    return EditorState.push(editorState, newContentState, 'change-block-data');
  }

  //
  const handleIndentAction = (action) => {
    const block = getCurrentBlock(); // получаем текущий блок
    const currentDepth = block.getDepth(); // его текущий отступ
    let newDepth = currentDepth; //текущее значение отступа для использования в функции
  
    // определяем новый отступ в зависимости от действия (увеличить / уменьшить)
    if (action === 'increase-indent' && currentDepth < 4) {
      newDepth = currentDepth + 1;
    } else if (action === 'decrease-indent' && currentDepth > 0) {
      newDepth = currentDepth - 1;
    } else {
      return;
    }  
    const newBlock = block.set('depth', newDepth);
  
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
    const newBlockMap = blockMap.set(block.getKey(), newBlock);
  
    const newContentState = content.merge({
      blockMap: newBlockMap,
      selectionAfter: editorState.getSelection(),
    });
  
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'adjust-depth'
    );
    setEditorState(newEditorState);
  };

  // переменная со всеми функциями для разных типов элементов
  const BUTTON_ACTIONS = {
    style: (editorState, setEditorState, value) =>
      setEditorState(RichUtils.toggleInlineStyle(editorState, value)), //для inline элементов
  
    type: (editorState, setEditorState, value) =>
      setEditorState(RichUtils.toggleBlockType(editorState, value)), //для блочных элементов
  
    action: (editorState, setEditorState, value, getCurrentBlock) =>
      handleIndentAction(value, editorState, setEditorState, getCurrentBlock), //отступы (работают только для СПИСКОВ. Из коробки не поддерживаются для иных элементов)
                                                                              // при экспорте разметки отдельная функция парсит "костыльные" отступы и преобразует в пробелы
  
    alignment: (editorState, setEditorState, value) => { //выравнивание текста в строке
      const newEditorState = applyBlockAlignment(editorState, value);
      setEditorState(newEditorState);
    }
  };

  //функция, принимающая конфиг каждой кнопки и выполняющая действие на основании полей action и actionValue
  const executeBtnAction = (btnConfig) => {
    const { action, actionValue } = btnConfig;
    const handler = BUTTON_ACTIONS[action];
    if (handler) {
      handler(editorState, setEditorState, actionValue, getCurrentBlock);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 10, padding: '15px', display: 'flex', alignItems: 'center' }}>
      {
        //маппинг кнопок
        BUTTON_INLINE_STYLES.map((btnConfig) => {
          //функция для добавления цвета активным кнопкам (разметка, которая применяется к вводимому тексту)
          const isActive = (() => {
            switch (btnConfig.action) {
              case 'style':
                return currentStyle.has(btnConfig.actionValue);
              case 'type':
                return currentBlockType === btnConfig.actionValue;
              case 'alignment':
                const currentAlignment = getCurrentBlock().getData().get('text-align') || 'left';
                return currentAlignment === btnConfig.actionValue;
              default:
                return false;
            }
          })();

          //функция дизейбла кнопок отступов
          const toggleIndentButtonsActitity = () => {
            if (btnConfig.actionValue === 'increase-indent') {
              return getCurrentBlock().getDepth() === 4;
            } else if (btnConfig.actionValue === 'decrease-indent') {
              return getCurrentBlock().getDepth() === 0;
            }
            return false;
          }

          return (
            !btnConfig.selectOptions ? (
              <IconButton
                key={btnConfig.label}
                title={btnConfig.label}
                disabled={toggleIndentButtonsActitity()}
                sx={{
                  padding: '6px',
                  marginRight: '6px',
                  borderRadius: '50%',
                  border: isActive ? '2px solid #4caf50' : '2px solid transparent',
                  // backgroundColor: isActive ? '#e8f5e9' : 'transparent',
                  transition: 'all 0.2s ease-in-out',
                }}
                color={isActive ? 'success' : 'default'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  // executeBtnAction(btnConfig);
                  executeBtnAction(btnConfig);
              }}
            >
              {btnConfig.icon}
            </IconButton>
            ) : (
              <Select
                key={btnConfig.label}
                value={currentBlockType}
                onChange={(e) => {
                  toggleSelectHeadings(e.target.value);
                }}
                size="small"
                sx={{ minWidth: 160, marginRight: '6px' }}
                color={isActive ? 'success' : 'default'}
                title={btnConfig.label}
              >
                {/* маппинг options для select'a с заголовками. Slice'om НЕ рендерит первый option из массива */}
                {btnConfig.selectOptions.slice(1).map((option, index) => (
                  <MenuItem value={option.selectType} key={option.optionTitle}>
                    <Typography
                      variant={`h${option.optionTitle.slice(-1)}`}
                      sx={{
                        fontSize: `${20 - (index + 1)}px`
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
        // handleKeyCommand={handleKeyCommand} //для добавления разметки через комбинации клавиш
        style={{height: '100%'}}
        blockStyleFn={blockStyleFn}
        // readOnly={true} //делаем редактор только для чтения
      />
    </div>
    </>
  );
}