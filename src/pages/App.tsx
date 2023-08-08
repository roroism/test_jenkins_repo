import React from 'react';
import { RouterProvider } from 'react-router';
import { AssetList } from './Asset/AssetList';
import { Auth } from './Auth/Auth';
import { createBrowserRouter } from 'react-router-dom';
import { AppBody } from './AppBody';
import { SignIn } from './Auth/SignIn';
import { DeviceInfo } from './Device/DeviceInfo';
import { DeviceList } from './Device/DeviceList';
import { HomeInfo } from './Home/Info';
import { LayoutEditorEntry } from './LayoutEditor/LayoutEditorEntry';
import { LayoutEditorMain } from './LayoutEditor/LayoutEditorMain';
import { LogList } from './Log/LogList';
import { PresentationList } from './Presentation/PresentationList';
import { CategoryList } from './Category/CategoryList';
import { ContentList } from './Content/ContentList';
import { InstantMessageList } from './InstantMessage/InstantMessageList';
import { Terms } from './Auth/Register';
import { SignUpForm } from './Auth/Register/SignUpForm';
import { ForgotPassword } from './Auth/ForgotPassword';
import { WidgetList } from './Widget/WidgetList';
import { StorePresentationList } from './Store/StorePresentationList';
import { StoreAssetList } from './Store/StoreAssetList';
import { ShopCart } from './Store/ShopCart';
import { Users } from './Users/Users';
import { Groups } from './Groups/Groups';
import SocietyInfo from './Groups/SocietyInfo/SocietyInfo';
const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
    children: [
      { index: true, element: <SignIn /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <Terms /> },
      { path: 'signup/terms', element: <Terms /> },
      { path: 'signup/form', element: <SignUpForm /> },
      { path: 'forgot', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/',
    element: <AppBody />,
    children: [
      { index: true, element: <HomeInfo /> },
      { path: 'home', element: <HomeInfo /> },
      { path: 'device', element: <DeviceList /> },
      { path: 'device/:deviceId', element: <DeviceInfo /> },
      { path: 'category', element: <CategoryList /> },
      // { path: 'content', element: <ContentList /> },
      { path: 'instantMessage', element: <InstantMessageList /> },
      { path: 'presentation', element: <PresentationList /> },
      { path: 'store', element: <StorePresentationList /> },
      { path: 'store/presentation', element: <StorePresentationList /> },
      { path: 'store/asset', element: <StoreAssetList /> },
      { path: 'widget', element: <WidgetList /> },
      { path: 'asset', element: <AssetList /> },
      { path: 'systemLogs', element: <LogList /> },
      { path: 'layoutEditor', element: <LayoutEditorEntry /> },
      { path: 'layoutEditor/entry', element: <LayoutEditorEntry /> },
      { path: 'layoutEditor/new', element: <LayoutEditorMain mode='ADD' /> },
      { path: 'layoutEditor/new/:presentationId', element: <LayoutEditorMain mode='COPY' /> },
      { path: 'layoutEditor/:presentationId', element: <LayoutEditorMain mode='EDIT' /> },
      { path: 'users', element: <Users /> },
      { path: 'groups', element: <Groups /> },
      { path: 'groups/:societyId', element: <SocietyInfo /> },
    ],
  },
  {
    errorElement: <div>404</div>,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
