const applyList = (list: any[], f: (arg: any) => any): any[] => {
  if (list.length === 0) {
    return [];
  }
  return [f(list[0])].concat(applyList(list.slice(1), f));
};

export default applyList;
