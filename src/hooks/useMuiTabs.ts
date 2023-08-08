import { TabsActions } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export function useMuiTabs<TabEnum extends any>(initialTab: TabEnum) {
  const tabsRef = useRef<TabsActions>();
  const [tab, setTab] = useState<TabEnum | false>(false);

  useEffect(() => {
    // 모든 컴포넌트가 마운트되기전에 Tab의 존재를 찾는 Mui자체의 버그
    // Tabs의 초기값을 false로 한 후, Tabs가 마운드된 후에 첫번째 탭을 선택하도록 함.
    // ref: https://github.com/mui/material-ui/issues/32749
    setTimeout(() => setTab(initialTab), 10);
    // Force emit window resize event after tab mounted,
    // to update indicator position and size.
    // Seems to bug of React-Mui.
    // ref: https://github.com/mui-org/material-ui/issues/9337
    if (!tabsRef.current) return;
    const callback = () => tabsRef.current?.updateIndicator();
    setTimeout(() => tabsRef.current?.updateIndicator(), 500);
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, []);

  const tabsProps = {
    value: tab,
    onChange: (_: any, newValue: TabEnum) => setTab(newValue),
    action: tabsRef,
  };

  return [tab, tabsProps] as const;
}
