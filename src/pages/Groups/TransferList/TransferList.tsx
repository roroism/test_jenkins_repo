import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import * as S from './TransferList.style';
import * as Layout from '@app/src/components/Layout.style';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useMemo, useState } from 'react';
import { userEdit } from '@app/src/apis/users/usersAPI.models';

export enum TransferListEnum {
  user = 'user',
  category = 'category',
}

interface TransferListProps {
  editLeftItems: {
    leftItems: any;
    setLeftItems: React.Dispatch<React.SetStateAction<any>>;
  };
  editRightItems: {
    rightItems: any;
    setRightItems: React.Dispatch<React.SetStateAction<any>>;
  };
  editManager?: {
    selectedManagers: any;
    setSelectedManagers: React.Dispatch<React.SetStateAction<any>>;
  };
  transferValue: TransferListEnum;
}
function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({
  editLeftItems: { leftItems: left, setLeftItems: setLeft },
  editRightItems: { rightItems: right, setRightItems: setRight },
  editManager,
  transferValue,
}: TransferListProps) {
  const { selectedManagers, setSelectedManagers } = editManager || {};

  const [checked, setChecked] = React.useState<readonly number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [targetText, setTargetText] = useState<string>('');

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // const handleSelectManagerToggle = (value: userEdit) => {
  //   console.log('handleSelectManagerToggle :: ', value);
  //   // const currentIndex = selectedManagers.indexOf(value);
  //   const currentIndex = selectedManagers.findIndex((item) => item.id === value.id);
  //   const newChecked = [...selectedManagers];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }
  //   console.log('handleSelectManagerToggle newChecked : ', newChecked);
  //   setSelectedManagers(newChecked);
  // };

  const handleSelectManagerToggle = (manager: userEdit) => {
    const currentIndex = selectedManagers.findIndex((item) => item.id === manager.id);
    if (currentIndex === -1) {
      setSelectedManagers([manager]);
    } else {
      setSelectedManagers([]);
    }
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
    setSelectedManagers([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    setSelectedManagers(not(selectedManagers, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  /**
   * Description
   * @author roro
   * @date 2023-08-07
   * @param {any} (
   * @returns {any}
   * @description 검색창에서 검색한 내용으로 필터링한 값들의 배열을 return 한다.
   */
  const filteredList = useMemo(() => {
    if (transferValue === TransferListEnum.user) {
      if (targetText === '') return right;
      return right.filter((user: any) => user?.username?.includes(targetText));
    } else if (transferValue === TransferListEnum.category) {
      if (targetText === '') return right;
      return right.filter((category: any) => category?.name?.includes(targetText));
    }
  }, [targetText]);

  /**
   * Description
   * @author roro
   * @date 2023-08-07
   * @param {any} items:readonly[]
   * @param {any} position:'left'|'right'
   * @returns {any}
   * @description TransferList 안의 item들을 렌더링하기 위한 함수이다.
   */
  const customList = (items: readonly [], position: 'left' | 'right') => {
    if (transferValue === TransferListEnum.user) {
      return (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
          <List dense component='div' role='list'>
            {items
              // .filter((user: any) => {
              //   if (position === 'left') return true;
              //   else return user.username.includes(targetText);
              // })
              ?.map((filteredUser: any) => {
                const labelId = `transfer-list-item-${filteredUser?.id}-label`;
                const isManager = selectedManagers[0]?.id === filteredUser.id;

                return (
                  <ListItem key={filteredUser?.id} role='listitem' sx={{ width: '100%' }}>
                    <Layout.Box display='flex' justifyContent='space-between' flexGrow='1'>
                      <S.StyledButton type='button' onClick={handleToggle(filteredUser)}>
                        <ListItemIcon sx={{ minWidth: '33px' }}>
                          <Checkbox
                            checked={checked.indexOf(filteredUser) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </ListItemIcon>
                        <S.StyledListItemText id={labelId} primary={`${filteredUser?.username}`} />
                      </S.StyledButton>
                      {position === 'left' && transferValue === TransferListEnum.user && (
                        <S.CheckboWxrapper>
                          <ListItemIcon
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              textAlign: 'right',
                              minWidth: '33px',
                            }}
                          >
                            <S.FormControlLabel
                              isSelected={isManager}
                              control={
                                <Checkbox
                                  checked={isManager}
                                  onChange={() => handleSelectManagerToggle(filteredUser)}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              }
                              label='Manager'
                            />
                          </ListItemIcon>
                          <S.SlashText>/</S.SlashText>
                          <ListItemIcon
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              textAlign: 'right',
                              minWidth: '33px',
                            }}
                          >
                            <S.FormControlLabel
                              isSelected={!isManager}
                              control={
                                <Checkbox
                                  checked={!isManager}
                                  onChange={() => handleSelectManagerToggle(filteredUser)}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              }
                              label='User'
                            />
                          </ListItemIcon>
                        </S.CheckboWxrapper>
                      )}
                    </Layout.Box>
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      );
    } else if (transferValue === TransferListEnum.category) {
      return (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
          <List dense component='div' role='list'>
            {items
              // .filter((category: any) => {
              //   if (position === 'left') return true;
              //   else return category?.name?.includes(targetText);
              // })
              ?.map((filteredCategory: any) => {
                const labelId = `transfer-list-item-${filteredCategory?.id}-label`;
                return (
                  <ListItem key={filteredCategory?.id} role='listitem' sx={{ width: '100%' }}>
                    <Layout.Box display='flex' justifyContent='space-between' flexGrow='1'>
                      <S.StyledButton type='button' onClick={handleToggle(filteredCategory)}>
                        <ListItemIcon sx={{ minWidth: '33px' }}>
                          <Checkbox
                            checked={checked.indexOf(filteredCategory) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </ListItemIcon>
                        <S.StyledListItemText id={labelId} primary={`${filteredCategory?.name}`} />
                      </S.StyledButton>
                    </Layout.Box>
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      );
    }
  };

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    let timerId;

    timerId = setTimeout(() => {
      setTargetText(searchText);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  return (
    <S.TransferListWrapper>
      <Grid container spacing={2} justifyContent='center' alignItems='center'>
        <Grid item direction='column' justifyContent='flex-end'>
          <Grid item sx={{ height: '38.13px', marginBottom: '4px' }}></Grid>
          <Grid item>{customList(left, 'left')}</Grid>
        </Grid>
        <Grid item>
          <Grid container direction='column' alignItems='center'>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label='move all right'
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label='move selected right'
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label='move selected left'
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant='outlined'
              size='small'
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label='move all left'
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item direction='column'>
          <Grid item>
            <S.Search>
              <S.SearchIconWrapper>
                <SearchIcon />
              </S.SearchIconWrapper>
              <S.StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </S.Search>
          </Grid>
          <Grid item>{customList(filteredList, 'right')}</Grid>
        </Grid>
      </Grid>
    </S.TransferListWrapper>
  );
}
