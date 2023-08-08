export const right = {
  USER: 0,
  MANAGER: 1,
  ADMIN: 2,
};

// 메뉴 접근 권한 명시
// ex) society.create -> 그룹 생성은 MANAGER(1) 이상 가능
export const actionRight = {
  society: {
    create: right.ADMIN,
    edit: right.MANAGER,
    delete: right.MANAGER,
  },
};
