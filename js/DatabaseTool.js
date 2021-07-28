//*************求闭包【Start】****************
//求所有组合
function allCombinations(strArr, index=0, group=[]) {
  let need_apply = [];
  need_apply.push(strArr[index]);
  for(let i = 0; i < group.length; i++) {
    need_apply.push(group[i] + strArr[index]);
  }
  group.push.apply(group, need_apply);

  if(index + 1 >= strArr.length) {
    return group;
  }
  else {       
    return allCombinations(strArr, index + 1, group);
  }
}

//求反射
function closureReflect(strArr, closureReflectArr=[]) {
  let combArr = [];
  let allCombArr = allCombinations(strArr);
  for (let i=0; i<allCombArr.length; i++) {
    combArr = allCombinations(allCombArr[i]);
    for (let j=0; j<combArr.length; j++) {
        closureReflectArr.push(allCombArr[i] + '->' + combArr[j]);
    }
  }
  return closureReflectArr;
}

//将字符串中的字符提取出来单独存入数组中
function extractChar(str) {
  let strArr = []; //用于接收allDependenceArr中包含的所有的字母
  for (let character of str) {
    if ( /^[a-zA-Z]+$/.test(character) ) {
      if (!strArr.includes(character)) { //数组中没有该字母则添加
        strArr.push(character);
      }
    }
  }
  strArr = strArr.sort();
  
  return strArr;
}

//求依赖关系的左半部分
function leftDependence(allDependenceArr) {
  let leftArr = [];
  let str = '';
  for (let i=0; i<allDependenceArr.length; i++) {
    let c = undefined;
    for (let j=0; j<allDependenceArr[i].length; j++) {
      c = allDependenceArr[i].charAt(j);
      if (c == '-') {
        break;
      }
      str = str.concat(c);
    }
    leftArr.push(str);
    str = '';
  }
  return leftArr;
}
//求依赖关系的右半部分
function rightDependence(allDependenceArr) {
  let rightArr = [];
  let tempArr = [];
  for (let i=0; i<allDependenceArr.length; i++) {
    rightArr.push((allDependenceArr[i].split(/-->|->|-/g))[1]); //以-->或->或-为分隔符，并把右边部分存入数组
  }

  return rightArr;
}

//按字母大小顺序插入
function insertStr(str, character) {
  let i = undefined;
  let position = undefined;
  for (i=0; i<str.length; i++) {
    if  (character < str[i]) {
      position = i;
      break;
    }
  }
  if (i == str.length) {
    position = i;
  }
  return str.slice(0, position) + character + str.slice(position);
}

//求扩展
function closureAugment(allDependenceArr, strArr) {
  let closureAugmentArr = [];
  
  //存依赖关系的左半部分
  let leftArr = leftDependence(allDependenceArr);
  //存依赖关系的右半部分
  let rightArr = rightDependence(allDependenceArr);
  
  //求扩展部分
  closureAugmentArr = closureAugmentArr.concat(allDependenceArr);
  for (let i=0; i<leftArr.length; i++) {
    //求出F中每个依赖关系左半部分的全排列，再与其右半部分进行组合
    let leftStrArr = extractChar(leftArr[i]);
    let allCombArr = allCombinations(leftStrArr); 
    for (let j=0; j<allCombArr.length; j++) {
      closureAugmentArr.push(leftArr[i] + '->' + (allCombArr[j]+rightArr[i]).split('').sort().join(''));
    }
  }

  for (let i=0; i<leftArr.length; i++) {
    for (let j=0; j<strArr.length; j++) {
      //找到strArr中不在当前依赖关系中的字母，进行扩展
      if (!leftArr[i].includes(strArr[j]) && !rightArr[i].includes(strArr[j])) {
        let str1 = insertStr(leftArr[i], strArr[j]);
        let newDependence = str1 + '->' + rightArr[i];
        //去除重复依赖
        if (!closureAugmentArr.includes(newDependence)) {
          leftArr.push(str1);
          rightArr.push(rightArr[i]);
          closureAugmentArr.push(newDependence);
        }
        let str2 = insertStr(rightArr[i], strArr[j]);
        newDependence = str1 + '->' + str2;
        if (!closureAugmentArr.includes(newDependence)) { 
          leftArr.push(str1);
          rightArr.push(str2);
          closureAugmentArr.push();
        }
      } 
      //找到strArr中在依赖左边但不在依赖右边的字母，进行扩展
      if (leftArr[i].includes(strArr[j]) && !rightArr[i].includes(strArr[j])) {
        let str = insertStr(rightArr[i], strArr[j]);
        let newDependence = leftArr[i] + '->' + str;
        if (!closureAugmentArr.includes(newDependence)) {                
          leftArr.push(leftArr[i]);
          rightArr.push(str);
          closureAugmentArr.push(newDependence);   
        }
      }
      //找到strArr中在依赖右边但不在依赖左边的字母，进行扩展
      if (!leftArr[i].includes(strArr[j]) && rightArr[i].includes(strArr[j])) {
        let str = insertStr(leftArr[i], strArr[j]);
        let newDependence = str + '->' + rightArr[i];
        if (!closureAugmentArr.includes(newDependence)) {                
          leftArr.push(str);
          rightArr.push(rightArr[i]);
          closureAugmentArr.push(newDependence);   
        }
      }
    }
  }
  return closureAugmentArr;
}

//在数组arr中查找出现的字符character的地方，并返回一个包含匹配索引的数组
function findAll(arr, character){
  let results=[],
    len=arr.length,
    pos=0;
  while(pos<len){
    pos=arr.indexOf(character, pos);
    if(pos===-1){//未找到就退出循环完成搜索
      break;
    }
    results.push(pos);//找到就存储索引
    pos+=1;//并从下个位置开始搜索
  }
  return results;
}
//求传递依赖
function closureTransitive(allDependenceArr) {
  let leftArr = leftDependence(allDependenceArr);
  let rightArr = rightDependence(allDependenceArr);
  let indexArr = []; //用于存放存在传递依赖的索引
  let closureTransitiveArr = [];
  
  let tempArr = [].concat(allDependenceArr); //数组克隆
  for (let i=0; i<rightArr.length; i++) {
    indexArr = findAll(leftArr, rightArr[i]);
    for (let j=0; j<indexArr.length; j++) {
      //如果依赖关系重复则不添加
      let dependence = leftArr[i] + '->' + rightArr[indexArr[j]];
      if (!tempArr.includes(dependence)) {  
        tempArr.push(dependence);
        closureTransitiveArr.push(dependence);
        leftArr.push(leftArr[i]);
        rightArr.push(rightArr[indexArr[j]]);
      }
    }
  }    
  return closureTransitiveArr;
}

//存完整的依赖关系,从字符串中提取出依赖关系存入数组中
function allDependence(strF) {
  let str = '';
  let allDependenceArr = [];
  for (let i=0; i<strF.length; i++) {
    while (/[^A-z]/.test(strF[i])) {
      i++;
    }
    while (/[0-9A-z->]/.test(strF[i]) && i<strF.length) {
      str = str.concat(strF[i])
      i++;
    }
    allDependenceArr.push(str);
    str = '';
  }
  return allDependenceArr;
}

//求闭包
function closure(allDependenceArr, strArr) {
  let closureArr = []; //用于存闭包
  
  // //求反射
  // let closureReflectArr = closureReflect(strArr);
  // closureArr = closureArr.concat(closureReflectArr);
  //求扩展
  let closureAugmentArr = closureAugment(allDependenceArr, strArr);
  closureArr = closureArr.concat(closureAugmentArr);
  //求传递依赖
  let closureTransitiveArr = closureTransitive(closureArr);
  closureArr = closureArr.concat(closureTransitiveArr);
  
  return closureArr;
}

//打印闭包
function closurePrint(strF) {
  let allDependenceArr = allDependence(strF); //从字符串中提取出依赖关系存入数组
  let str = allDependenceArr.join('');
  let strArr = extractChar(str); //提取str中所含有的字符（不重复） 
  let closureText = 'F+ = {';
  closureText = closureText.concat(closure(allDependenceArr, strArr))
  closureText = closureText.concat('}');
  
  return closureText;
}

//对输入的依赖集合进行预处理
function pretreatment(strF) {
  let tempArr = [];
  let reg = /[a-zA-Z->,]/;
  for (let i=0; i<strF.length; i++) {
    if (reg.test(strF[i])) {
      tempArr.push(strF[i]);
    }
  }
  return tempArr.join('');
}

//求增广的交互界面
function closureAugmentPrint() {
	let content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    let result = '';
 
    let allDependenceArr = allDependence(content);
    result = closureAugment(allDependenceArr, extractChar(content)); 
    document.getElementById("showText").value ="【求增广】\r结果为："+ result;
}
//求传递的交互界面
function closureTransitivePrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  let allDependenceArr = allDependence(content);
  result = closureTransitive(allDependenceArr); 
  document.getElementById("showText").value ="【求传递】\r结果为："+ result;
}
//求闭包的交互界面
function closureInterface() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  result = closurePrint(content); 
  document.getElementById("showText").value ="【求闭包】\r结果为："+ result;
}
//*************求闭包【End】****************


//*************求最小依赖集【Start】****************
//求分解
function decomposeDependence(allDependenceArr) {
  let leftArr = leftDependence(allDependenceArr);
  let rightArr = rightDependence(allDependenceArr);
  let decomposeDependenceArr = []; //存入分解后的依赖关系
   
  for (let i=0; i<rightArr.length; i++) {
    if (rightArr[i].length > 1) {
      for (let j=0; j<rightArr[i].length; j++) {
        let str = leftArr[i] + '->' + rightArr[i][j];
        if (decomposeDependenceArr.includes(str)) {
          continue;
        }
        decomposeDependenceArr.push(str);
      }
    } else {
      if (decomposeDependenceArr.includes(allDependenceArr[i])) {
        continue;
      }
      decomposeDependenceArr.push(allDependenceArr[i]); //无法分解的依赖直接存在数组
    } 
  }
  return decomposeDependenceArr;
}

//判断两个数组内容是否相同(不考虑顺序)
function isSameContent (referArr, compareArr) {
  if (referArr.length != compareArr.length) {
    return false;
  }
  let j = undefined;
  for (j=0; j<referArr.length; j++) {
    if (!compareArr.includes(referArr[j])) {
      break;
    }
  }
  if (j == referArr.length) {
    return true;
  } else {
    return false;
  }
}

//##去除多余依赖 Start ##//
//对于右侧相同的依赖，判断其左侧是否经过其它依赖替换后也可以相同，如果相同则证明是多余的, leftElement即为待验证的左侧值
function isSubstitutable(dependenceArr, samerightLeftElement, leftElement) {
  let leftArr = leftDependence(dependenceArr);
  let rightArr = rightDependence(dependenceArr);
  let strArr = extractChar(leftElement); //将待验证的左侧值分解为单个字符存入数组中
  
  for (let i=0; i<strArr.length; i++) {
    //第一步：先判断strArr[i]是否包含在samerightLeftElement中，如果包含则不影响结果可以跳过，继续验证下一个字符
    if (samerightLeftElement.includes(strArr[i])) {
      continue;
    }
    //第二步：如果不包含在samerightLeftElement中，则将当前的strArr[i]验证在依赖集右值中的唯一性，即是否依赖于其它元素，如果唯一则证明不可替代，如果不唯一则进行下一步
    let samerightLeftArr = isExclusiveRight(leftArr, rightArr, strArr[i]);
    //rightArr[i]的值在rightArr中唯一则证明不多余
    if (samerightLeftArr.length === 0) {
      return false;
    }
    //第三步：上步如果不唯一则需要再判断samerightLeftArr中的值，即dependenceArr依赖集中右值与strArr[i]相等的依赖的值，是否包含在samerightLeftElement（具体含意见上级调用）中，即能否被间接替代
    for (let j=0; j<samerightLeftArr.length; j++) {
      if (lettersCheck(samerightLeftElement, samerightLeftArr[j])) {
        return true;
      }
    }
  }
}

//判断rightArr[i]的值在rightArr中是否唯一，如果唯一则证明依赖不多余，如果不唯一则将对应的所有leftArr[i]作为数组返回
function isExclusiveRight(leftArr, rightArr, rightElement) {
  let samerightLeftArr = [];
  for (let i=0; i<rightArr.length; i++) {
    if (rightArr[i] === rightElement) {
      samerightLeftArr.push(leftArr[i])
    }
  }
  return samerightLeftArr;
}
// 用于判断依赖否多余
function isRedundant(dependenceArr, leftElement, rightElement) {
  let leftArr = leftDependence(dependenceArr);
  let rightArr = rightDependence(dependenceArr);
  
  for (let i=0; i<rightArr.length; i++) {
    //第一步：判断rightElement的值在rightArr中是否唯一，如果唯一则证明依赖不多余，如果不唯一则将对应的所有leftArr[i]作为数组返回
    let samerightLeftArr = isExclusiveRight(leftArr, rightArr, rightElement);
    //当前依赖右侧的值在整个右侧依赖集中是唯一的则证明无法被替代，即不多余
    if (samerightLeftArr.length === 0) {
      return false;
    }
    
    //第二步：如果待判断是否多余的依赖的左值leftElement完全包含了samerightLeftArr[i]的值，samerightLeftArr[i]就是在整个依赖集中与待判断的依赖右值相等的依赖的左值。
    let isInclusive = lettersCheck(leftElement, samerightLeftArr[i]); //判断子串samerightLeftArr[i]是否所有的字符都包含在主串rightArr[i]中
    //如果samerightLeftArr[i]中的字符均包含在rightArr[i]中则证明多余
    if (isInclusive) {
      return true;
    }
    
    //第三步：判断具有和待验证依赖相同右侧的依赖的左侧，是否可被完整替换成待验证的依赖的左侧相同
    for (let j=0; j<samerightLeftArr.length; j++) {      
      //判断samerightLeftArr[j]，即具有和待验证依赖相同右侧的依赖的左侧是否可被完整替换成待验证的依赖的左侧相同，若可被完整替换则证明等验证的依赖是多余的
      let isReplace = isSubstitutable(dependenceArr, samerightLeftArr[j], leftElement);
      if (isReplace) {
        return true;
      }
    }
    
    return false;
  }
}

//去除多余依赖主函数
function reduceRedundant(allDependenceArr) {
  let tempDependenceArr = allDependenceArr.slice();
  let leftArr = leftDependence(tempDependenceArr);
  let rightArr = rightDependence(tempDependenceArr);
  for (let i=0; i<tempDependenceArr.length; i++) {
    let tempArr = tempDependenceArr.slice();
    //避免当前依赖重复验证，暂时去除
    tempArr.splice(i, 1);
    let flag = isRedundant(tempArr, leftArr[i], rightArr[i]);
    if (flag === true) {
      tempDependenceArr.splice(i, 1);
      leftArr.splice(i, 1);
      rightArr.splice(i, 1);
      i--;
    }
  }
 
  return tempDependenceArr;
}
//##去除多余依赖 End ##//

//##去除不相干的字符(即属性) Start ##//
// //判断依赖左值中某个字符ch，是否可以由剩余的字符间接推导出来
// function isIndirectSubstitution(dependenceArr, samerightLeftElement, leftElement) {
//   let leftArr = leftDependence(dependenceArr);
//   let rightArr = rightDependence(dependenceArr);
//   let strArr = extractChar(leftElement); //将待验证的左侧值分解为单个字符存入数组中
  
//   for (let i=0; i<strArr.length; i++) {
//     //第一步：先判断strArr[i]是否包含在samerightLeftElement中，如果包含则不影响结果可以跳过，继续验证下一个字符
//     if (samerightLeftElement.includes(strArr[i])) {
//       continue;
//     }
//     //第二步：如果不包含在samerightLeftElement中，则将当前的strArr[i]验证在依赖集右值中的唯一性，即是否依赖于其它元素，如果唯一则证明不可替代，如果不唯一则进行下一步
//     let samerightLeftArr = isExclusiveRight(leftArr, rightArr, strArr[i]);
//     //rightArr[i]的值在rightArr中唯一则证明不多余
//     if (samerightLeftArr.length === 0) {
//       return false;
//     }
//     //第三步：上步如果不唯一则需要再判断samerightLeftArr中的值，即dependenceArr依赖集中右值与strArr[i]相等的依赖的值，是否包含在samerightLeftElement（具体含意见上级调用）中，即能否被间接替代
//     for (let j=0; j<samerightLeftArr.length; j++) {
//       if (lettersCheck(samerightLeftElement, samerightLeftArr[j])) {
//         return true;
//       }
//     }
//   }
// }

//判断去除的字符ch是否可由tempLeftElement(即去除ch后的剩下的字符串)直接或间接推导出
function isExtraneous(dependenceArr, tempLeftElement, ch) {
  let leftArr = leftDependence(dependenceArr);
  let rightArr = rightDependence(dependenceArr);
  //第一步：判断ch的值在rightArr中是否唯一，如果是则可以进行下一步判断，否则证明ch字符不多余
  let samerightLeftArr = isExclusiveRight(leftArr, rightArr, ch);
  if (samerightLeftArr.length === 0) {
    return false;
  }
  
  for (let i=0; i<samerightLeftArr.length; i++) {    
    //第二步：如果待判断是否多余的依赖的左值tempLeftElement完全包含了samerightLeftArr[i]的值，samerightLeftArr[i]就是在整个依赖集中与待判断的依赖右值相等的依赖的左值。
    let isInclusive = lettersCheck(tempLeftElement, samerightLeftArr[i]); //判断子串samerightLeftArr[i]是否所有的字符都包含在主串rightArr[i]中
    //如果samerightLeftArr[i]中的字符均包含在tempLeftElement中则证明ch是不相干的属性
    if (isInclusive) {
      return true;
    }
  }
  
  //第三步：判断ch是否可由tempLeftElement间接推导出，如ABD中tempLeftElement是AD， ch是B，判断B是否可由AD间接推出
  for (let j=0; j<samerightLeftArr.length; j++) {      
    //
    let isReplace = isSubstitutable(dependenceArr, tempLeftElement, samerightLeftArr[j]);
    if (isReplace) {
      return true;
    }
  }
  return false;
}
//判断是否有可去除的字符（即属性），去除leftElement中不相干的属性，并更新leftArr
function reduceAttribute(dependenceArr, num) {
  let leftArr = leftDependence(dependenceArr);
  let rightArr = rightDependence(dependenceArr);
  let leftElement = leftArr[num]; 
  if (leftElement.length === 1) {
    return leftElement;
  }
  
  let tempArr = dependenceArr.slice();
  //避免当前依赖重复验证，暂时去除
  tempArr.splice(num, 1);
  let tempLeftElement = leftElement;
  for (let j=0; j<tempLeftElement.length; j++) {
    let tempLeftElementArr = tempLeftElement.split('');
    let ch = tempLeftElementArr[j];
    tempLeftElementArr.splice(j, 1);
    tempLeftElement = tempLeftElementArr.join('');
    
    let flag = isExtraneous(tempArr, tempLeftElement, ch);
    if (flag) {
      leftElement = tempLeftElement;
      j--;
    }
    tempLeftElement = leftElement;
  }
  
  return leftElement;
}
//去除不相干的字符(即属性)主函数
function reduceExtraneous(dependenceArr) {
  let leftArr = leftDependence(dependenceArr);
  let rightArr = rightDependence(dependenceArr);
  
  for (let i=0; i<dependenceArr.length; i++) {
    //判断左值是否有可去除的不相干的属性
    let leftElement = reduceAttribute(dependenceArr, i);
    if (leftArr[i] !== leftElement) {
      leftArr[i] = leftElement;
    }
  }
  
  let newDependenceArr = [];
  for (let i=0; i<dependenceArr.length; i++) {
    newDependenceArr[i] = leftArr[i] + "->" + rightArr[i];
  }
  return newDependenceArr;
}
//##去除不相干的字符(即属性) End ##//

//最小依赖集
function reduceDependence(allDependenceArr) {
  let decomposeDependenceArr = decomposeDependence(allDependenceArr);
  let reduceRedundantArr = reduceRedundant(decomposeDependenceArr);
  let reduceExtraneousArr = reduceExtraneous(reduceRedundantArr);
  
  return reduceExtraneousArr;
}
//打印最小依赖集结果
function reduceDependencePrint(strF) {
  let allDependenceArr = allDependence(strF);
  let reduceDependenceArr = reduceDependence(allDependenceArr);
  
  return reduceDependenceArr;
}

//分解依赖的交互界面
function decomposeDependencePrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  let allDependenceArr = allDependence(content);
  result = decomposeDependence(allDependenceArr); 
  document.getElementById("showText").value ="【分解依赖】\r结果为："+ result;
}
//去除多余依赖的交互界面
function reduceRedundantPrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  let allDependenceArr = allDependence(content);
  let decomposeDependenceArr = decomposeDependence(allDependenceArr);
  result = reduceRedundant(decomposeDependenceArr); 
  document.getElementById("showText").value ="【去除多余依赖】\r结果为："+ result;
}
//去除多余属性的交互界面
function reduceExtraneousPrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  let allDependenceArr = allDependence(content);
  let decomposeDependenceArr = decomposeDependence(allDependenceArr);
  let reduceRedundantArr = reduceRedundant(decomposeDependenceArr);
  result = reduceExtraneous(reduceRedundantArr); 
  document.getElementById("showText").value ="【去除多余属性】\r结果为："+ result;
}
//求最小依赖集的交互界面
function reduceInterface() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  result = reduceDependencePrint(content); 
  document.getElementById("showText").value ="【求最小依赖集】\r结果为："+ result;
}
//*************求最小依赖集【End】****************


//*************求关键字【要Start】****************
//检测子串subStr中所有字母是否都在主串str中
function lettersCheck(str, subStr) {
  let subStrArr = subStr.split('');
  let n=0;
  for (let i=0; i<subStrArr.length; i++) {
    if (!str.includes(subStrArr[i])) {
      break;
    }
    n++;
  }
  if (n == subStrArr.length) {
    return true;
  } else {
    return false;
  }
}
//求属性集闭包
function attributeSetClosure(allDependenceArr, attribute) {
  let attributeSetClosureArr = [];
  let leftArr = leftDependence(allDependenceArr);
  let rightArr = rightDependence(allDependenceArr);
  
  let n = 1; //每次添加属性到attribute里面n都要加1，代表新的attribute还要再重新检查一次
  for (let i=0; i<n; i++) {
    for (let j=0; j<leftArr.length; j++) {
      if (lettersCheck(attribute, leftArr[j])) {
        if (attribute.search(rightArr[j]) == -1) {  
          attribute = insertStr(attribute, rightArr[j]);
          n++;
        }
      }
    }
  }
  attributeSetClosureArr = attributeSetClosureArr.concat(attribute.split(''));
  
  return attributeSetClosureArr;
}

//求候选码（候选关键字）
function candidateKeys(allDependenceArr) {
  let strArr = extractChar(allDependenceArr.join('')); //R（依赖中包含的所有字符）
  let allCombArr = allCombinations(strArr); //求所有的组合，作为候选结果
  let candidateKeysArr = [];
  let decomposeDependenceArr = decomposeDependence(allDependenceArr);
  for (let i=0; i<allCombArr.length; i++) {
    let attributeSetClosureArr = attributeSetClosure(decomposeDependenceArr, allCombArr[i]);
    if (isSameContent(strArr, attributeSetClosureArr)) {
      candidateKeysArr.push(allCombArr[i]);
    }
  }
  
  return candidateKeysArr;
}

//打印候选码
function candidateKeysPrint(strF) {
  let allDependenceArr = allDependence(strF);
  let candidateKeysArr = candidateKeys(allDependenceArr);
  return candidateKeysArr;
}
//求主码的交互界面
function keyWordPrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  result = candidateKeysPrint(content); 
  document.getElementById("showText").value ="【求主码】\r结果为："+ result[0];
}
//求候选码（候选关键字）的交互界面
function candidateKeysInterface() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content); //接收进行预处理后的依赖集
  let result = '';

  result = candidateKeysPrint(content); 
  document.getElementById("showText").value ="【求候选码】\r结果为："+ result;
}
//*************求关键字【End】****************


//*************模式分解【Start】****************
//计算numberOfDecompose，即原数组中每个依赖集分解成的依赖集的数量
function calNumberOfDecompose(originalArr, finalArr) {
  let decomposeArr = [];
  //求originalArr中每个数组最终分解成的数组个数
  for (let i=0; i<originalArr.length; i++) {
    decomposeArr[i] = []; //将originalArr[i]中分解出去的所有元素都存入该数组中
    for (let j=0; j<originalArr[i].length; j++) {
      if (!finalArr[i].includes(originalArr[i][j])) {
        decomposeArr[i].push(originalArr[i][j]);
      }
    }
  }
  
  for (let i=0; i<originalArr.length; i++) {
    let n = 0;
    originalArr[i].numberOfDecompose = 1; //记录分解成的数组数量
    for (let j=0; j<finalArr.length; j++) {
      let flag = false;
      for (let k=0; k<decomposeArr[i].length; k++) {  
        if (finalArr[j].includes(decomposeArr[i][k])) {
          flag = true;
          n = k;
          break;
        }
      }
      if (flag == true) {
        originalArr[i].numberOfDecompose++;
      }
  }
  }
}

//1NF->2NF
function decompose1NF(allDependenceArr) {
  let firstParadigmArr = [];
  firstParadigmArr[0] = allDependenceArr.slice();
  let leftArr = leftDependence(allDependenceArr);
  let rightArr = rightDependence(allDependenceArr);
  let key = candidateKeys(allDependenceArr)[0]; //求关键字
  let letterArr = extractChar(key);
  let foreignKey = [];
  let tempArr = [];
  let n = 0;
  tempArr[n++] = allDependenceArr.slice();
  
  for (let i=0; i<letterArr.length; i++) {
    if (leftArr.includes(letterArr[i])) {
      foreignKey.push(letterArr[i]);
    }
  }
  
  if (letterArr.length == 1) {
    return tempArr;
  }
  
  allDependenceArr.flag = false; //用于标记原依赖关系是否需要被分解为2NF，flase表示不需要分解
  for (let i=0; i<foreignKey.length; i++) {
    tempArr[n] = [];
    for (let j=0; j<tempArr[0].length; j++) {
      //非主属性完全函数依赖于码
      if (!key.includes(rightArr[j]) && leftArr[j] == foreignKey[i]) {
        tempArr[n].push(leftArr[j] + '->' + rightArr[j]);
        allDependenceArr.flag = true;
        
        //功能：将外键foreignKey[i]包含的传递依赖也放到新数组中去，【例如外键B对应的B->D, D->E将D->E放入】
        (function (str) {
          let strArr = [];
          strArr.push(str);
          for (let m=0; m<strArr.length; m++) {
            for (let k=j+1; k<leftArr.length; k++) {
              if (str == leftArr[k]) {
                strArr.push(rightArr[k]);
                tempArr[n].push(str + '->' + rightArr[k]);
                tempArr[0].splice(k, 1);
                leftArr.splice(k, 1);
                rightArr.splice(k, 1);
                k--; //__v1.0.0版本bug_1修复
              }
            }
          }
        })(rightArr[j]);
        
        tempArr[0].splice(j, 1);
        leftArr.splice(j, 1);
        rightArr.splice(j, 1);
        j--;
      }
    }
    if (tempArr[n].length == 0) {
      tempArr.length--;
    } else {
      n++;
    }
  }
  
  calNumberOfDecompose(firstParadigmArr, tempArr);
  allDependenceArr.numberOfDecompose = firstParadigmArr[0].numberOfDecompose;
  
  //注意tempArr的第一个数组元素可能会为空，以下循环用于进行清除无效数组元素
  for (let i=0; i<tempArr.length; i++) {
    if (tempArr[i].length == 0) {
      tempArr.splice(i, 1);
      continue;
    }
    break;
  }
  return tempArr;
}

//2NF->3NF
function decompose2NF(secondParadigmArr) {
  let tempArr = [];
  let num = secondParadigmArr.length; //2NF的数组个数
  let flagNum = 0; //记录flag为true的数量
  //拷贝
  for (let i=0; i<num; i++) {
    tempArr[i] = [].concat(secondParadigmArr[i]);
  }
  
  let newNum = num; //用于记录3NF的数组个数
  
  for (let i=0; i<tempArr.length; i++) {
    return secondParadigmArr;
    let key = candidateKeys(tempArr[i])[0];
    let leftArr = leftDependence(tempArr[i]);
    let rightArr = rightDependence(tempArr[i]);
    
    if (i<secondParadigmArr.length) {
      secondParadigmArr[i].flag = false;
    }
    tempArr[newNum] = [];
    for (let j=0; j<leftArr.length; j++) {
      //注意：1NF->2NF分解后出来的组里存的值中，包含传递依赖的仅有左值不等于当前组主码的值
      if (!key.includes(rightArr[j]) && key!=leftArr[j]) { //注意，如果传递依赖指向的是主属性则不处理
        if (i<secondParadigmArr.length) {
          flagNum++;
          secondParadigmArr[i].flag = true;
        }
        tempArr[newNum].push(tempArr[i][j]);
        tempArr[i].splice(j, 1);
        leftArr.splice(j, 1); 
        rightArr.splice(j, 1);
        j--;
      }
    }
  }
  
  calNumberOfDecompose(secondParadigmArr, tempArr);
  
  //标记secondParadigmArr能否被分解
  if (flagNum!=0) {
    secondParadigmArr.flag = true;
  } else {
    secondParadigmArr.flag = false;
  }
  
  return tempArr;
}

//3NF->BCNF
function decompose3NF(thirdParadigmArr) {
  let tempArr = [];
  let num = thirdParadigmArr.length;
  let flagNum = 0; //记录flag为true的数量
  //拷贝
  for (let i=0; i<num; i++) {
    tempArr[i] = [];
    tempArr[i] = [].concat(thirdParadigmArr[i]);
  }
  
  let newNum = num; //用于记录3NF的数组个数
  for (let i=0; i<tempArr.length; i++) {        
    let key = candidateKeys(tempArr[i])[0];
    let leftArr = leftDependence(tempArr[i]);
    let rightArr = rightDependence(tempArr[i]);
    
    if (i<thirdParadigmArr.length) {
      thirdParadigmArr[i].flag = false;
    }
    tempArr[newNum] = [];
    for (let j=0; j<leftArr.length; j++) {
      if (key != leftArr[j]) {
        if (i<thirdParadigmArr.length) {
          flagNum++;
          thirdParadigmArr[i].flag = true;
        }
        tempArr[newNum].push(tempArr[i][j]);
        tempArr[i].splice(j, 1);
        leftArr.splice(j, 1); 
        rightArr.splice(j, 1);
        j--;
      }
    }
    if (tempArr[newNum].length == 0) {
      tempArr.length--;
    } else {
      newNum++;
    }
  }
  
  calNumberOfDecompose(thirdParadigmArr, tempArr);
  
  //标记thirdParadigmArr能否被分解
  if (flagNum!=0) {
    thirdParadigmArr.flag = true;
  } else {
    thirdParadigmArr.flag = false;
  }
  
  //注意tempArr的第一个数组元素可能会为空，以下循环用于进行清除无效数组元素
  for (let i=0; i<tempArr.length; i++) {
    if (tempArr[i].length == 0) {
      tempArr.splice(i, 1);
      continue;
    }
    break;
  }
  
  return tempArr;
}

/*模式分解的交互界面Start*/
//求1NF->2NF的交互界面
function decompose1NFPrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content);
  let result = '';
  
  let allDependenceArr = allDependence(content);
  let reduceDependenceArr = reduceDependence(allDependenceArr);

  let secondParadigmArr = decompose1NF(reduceDependenceArr); 
  for (let i=0; i<secondParadigmArr.length; i++) {
    if (secondParadigmArr.length > 1) {
      result += 'R' + (i+1) + '={' + extractChar(secondParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + secondParadigmArr[i] + '}, 主码为：' + candidateKeys(secondParadigmArr[i])[0] + '\r';
    } else {
      result += '无法从1NF->2NF';
    }
  }
  
  document.getElementById('showText').value ="【分解为2NF】\r结果为：\r" + result;
  
  let sqlDatas = '';
  for (let i=0; i<secondParadigmArr.length; i++) {
    if (secondParadigmArr.length > 1) {
      sqlDatas += generateSql(extractChar(secondParadigmArr[i].join('')), candidateKeys(secondParadigmArr[i])[0]);
    }
  }
  document.getElementById('sqlDatas').value = sqlDatas;
}
//求2NF->3NF的交互界面
function decompose2NFPrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content);
  let result = '';
  
  let allDependenceArr = allDependence(content);
  let reduceDependenceArr = reduceDependence(allDependenceArr);

  let secondParadigmArr = decompose1NF(reduceDependenceArr); 
  let thirdParadigmArr = decompose2NF(secondParadigmArr);
  if (secondParadigmArr.flag == true) {  
    for (let i=0; i<thirdParadigmArr.length; i++) {
      result += 'R' + (i+1) + '={' + extractChar(thirdParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + thirdParadigmArr[i] + '}, 主码为：' + candidateKeys(thirdParadigmArr[i])[0] + '\r';
    }
  } else {
    result += '无法从2NF->3NF。';
  }
  
  document.getElementById("showText").value ="【分解为3NF】\r结果为：\r" + result;
  
  let sqlDatas = '';
  for (let i=0; i<thirdParadigmArr.length; i++) {
    if (thirdParadigmArr.length > 1) {
      sqlDatas += generateSql(extractChar(thirdParadigmArr[i].join('')), candidateKeys(thirdParadigmArr[i])[0]);
    }
  }
  document.getElementById('sqlDatas').value = sqlDatas;
}
//求3NF->BCNF的交互界面
function decompose3NFPrint() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content);
  let result = '';
  
  let allDependenceArr = allDependence(content);
  let reduceDependenceArr = reduceDependence(allDependenceArr);

  let secondParadigmArr = decompose1NF(reduceDependenceArr); 
  let thirdParadigmArr = decompose2NF(secondParadigmArr);
  let bcParadigmArr = decompose3NF(thirdParadigmArr);
  if (thirdParadigmArr.flag == true) {  
    for (let i=0; i<bcParadigmArr.length; i++) {
      result += 'R' + (i+1) + '={' + extractChar(bcParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + bcParadigmArr[i] + '}, 主码为：' + candidateKeys(bcParadigmArr[i])[0] + '\r';
    }
  } else {
    result += '无法从3NF->BCNF。';
  }
  
  document.getElementById("showText").value ="【分解为BCNF】\r结果为：\r" + result;
  
  let sqlDatas = '';
  for (let i=0; i<bcParadigmArr.length; i++) {
    if (bcParadigmArr.length > 1) {
      sqlDatas += generateSql(extractChar(bcParadigmArr[i].join('')), candidateKeys(bcParadigmArr[i])[0]);
    }
  }
  document.getElementById('sqlDatas').value = sqlDatas;
}
//模式分解的交互界面
function patternDecomposeInterface() {
	let content = document.getElementById("inputBox").value;
  content = pretreatment(content);
  let result = '';
  
  let allDependenceArr = allDependence(content);
  let reduceDependenceArr = reduceDependence(allDependenceArr);
  result += '求得最小依赖集为：R={' + extractChar(reduceDependenceArr.join('')) + '}, F={' + reduceDependenceArr + '}，主码为：' + candidateKeys(reduceDependenceArr)[0] + '\r\r'; 
  
  //输出1NF->2NF
  let No_last = 0; //用于记录分解后最后一个数组的序号
  result += '【1NF->2NF】\r';
  let secondParadigmArr = decompose1NF(reduceDependenceArr);
  if (reduceDependenceArr.flag == true) {
    result += 'R不满足2NF，可分解为';
    for (let i=0; i<secondParadigmArr.length; i++) {
      result += 'R' + (i+1);
      if (i != secondParadigmArr.length-1) {
        result += ',';
      } else {
        result += '。';
      }
    }
    result += '\r';
    
    for (let i=0; i<secondParadigmArr.length; i++) {
      result += '|| R' + (i+1) + '={' + extractChar(secondParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + secondParadigmArr[i] + '}' + '，主码为：' + candidateKeys(secondParadigmArr[i])[0] + '，满足2NF' + '\r';
      No_last = i+1;
    }
  } else {
    result += 'R满足2NF，不需要分解。\r';
  }
  result += '\r';
  
  //输出2NF->3NF
  result += '【2NF->3NF】\r';
  let thirdParadigmArr = decompose2NF(secondParadigmArr);
  let num = secondParadigmArr.length;
  let m = 0;
  let No_BCNFArr = []; //用于3NF->BCNF的分解出的数组的序号计算,记录未分解的数组的序号
  let No_first = []; //用于3NF->BCNF的分解出的数组的序号计算，记录首个分解出来的新数组序号
  for (let i=0; i<secondParadigmArr.length; i++) {        
    if (secondParadigmArr.length == 1 && secondParadigmArr[0].length!=1) {
      result += 'R' + '不满足3NF，可分解为';
    } else if (secondParadigmArr[i].flag == true) {
      result += 'R' + (i+1) + '不满足3NF，可分解为';
    } else {
      No_BCNFArr.push(i+1);
      if (i == secondParadigmArr.length-1) {
        result += 'R' + (i+1) + '满足3NF，不需要分解。\r\r';
      } else {
        result += 'R' + (i+1) + '满足3NF，不需要分解；\r';
      }
      continue;
    }
    
    let n;
    if (secondParadigmArr.length == 1) {
      n = 0;
    } else {
      n = 1;
    }
    
    let subArr = []; //用于存储R(i)中i的值
    for (let j=0; j<secondParadigmArr[i].numberOfDecompose; j++) {
      result += 'R' + (secondParadigmArr.length + n + m);
      subArr[j] = secondParadigmArr.length + n + m;
      n++;
      if (j != secondParadigmArr[i].numberOfDecompose-1) {
        result += ',';
      } else {
        result += '；';
      }
    }
    m += secondParadigmArr[i].numberOfDecompose;
    result += '\r';
    
    No_first.push(subArr[0]);
    result += '|| R' + subArr[0] + '={' + extractChar(thirdParadigmArr[i].join('')) + '}, F' + subArr[0] + '={' + thirdParadigmArr[i] + '}' + '，主码为：' + candidateKeys(thirdParadigmArr[i])[0] + '，满足3NF' + '\r';  
    for (let j=0; j<secondParadigmArr[i].numberOfDecompose-1; j++) {
      result += '|| R' + subArr[j+1] + '={' + extractChar(thirdParadigmArr[num].join('')) + '}, F' + subArr[j+1] + '={' + thirdParadigmArr[num] + '}' + '，主码为：' + candidateKeys(thirdParadigmArr[num])[0] + '，满足3NF' + '\r';
      num++;    
      No_last = subArr[j+1];
    }
    if (i == secondParadigmArr.length-1) {
      result += '\r';
    }
  }
  
  //输出3NF->BCNF
  result += '【3NF->BCNF】\r';
  let bcParadigmArr = decompose3NF(thirdParadigmArr);
  num = thirdParadigmArr.length;
  for (let i=0; i<thirdParadigmArr.length; i++) {
    if (thirdParadigmArr.length == 1 && thirdParadigmArr[0].length!=1) {
      result += 'R' + '不满足BCNF，可分解为';
    } else if (thirdParadigmArr[i].flag == true) {
      if (i < No_BCNFArr.length) {
        result += 'R' + No_BCNFArr[i] + '不满足BCNF，可分解为';
      } else {   
        result += 'R' + (No_first[0]++) + '不满足BCNF，可分解为';
      }
    } else {
      if (i == thirdParadigmArr.length-1) {
        if (i < No_BCNFArr.length) {
          result += 'R' + No_BCNFArr[i] + '满足BCNF，不需要分解;\r';
        } else {   
          result += 'R' + (No_first[0]++) + '满足BCNF，不需要分解。\r\r';
        }
      } else {
        if (i < No_BCNFArr.length) {
          result += 'R' + No_BCNFArr[i] + '满足BCNF，不需要分解;\r';
        } else {
          result += 'R' + (No_first[0]++) + '满足BCNF，不需要分解；\r';
        }
      }
      continue;
    }
    
    let n;
    if (thirdParadigmArr.length == 1) {
      n = 0;
    } else {
      n = 1;
    }
    
    let subArr = []; //用于存储R(i)中i的值
    for (let j=0; j<thirdParadigmArr[i].numberOfDecompose; j++) {
      result += 'R' + (No_last + j + 1);
      subArr[j] = No_last + j + 1;
      n++;
      if (j != thirdParadigmArr[i].numberOfDecompose-1) {
        result += ',';
      } else {
        result += '；';
      }
    }
    m += thirdParadigmArr[i].numberOfDecompose;
    result += '\r';
    
    result += '|| R' + subArr[0] + '={' + extractChar(bcParadigmArr[i].join('')) + '}, F' + subArr[0] + '={' + bcParadigmArr[i] + '}' + '，主码为：' + candidateKeys(bcParadigmArr[i])[0] + '，满足BCNF' + '\r';  
    for (let j=0; j<thirdParadigmArr[i].numberOfDecompose-1; j++) {
      result += '|| R' + subArr[j+1] + '={' + extractChar(bcParadigmArr[num].join('')) + '}, F' + subArr[j+1] + '={' + bcParadigmArr[num] + '}' + '，主码为：' + candidateKeys(bcParadigmArr[num])[0] + '，满足BCNF' + '\r';
      num++;      
    }
    if (i == thirdParadigmArr.length-1) {
      result += '\r\r';
    }
  }
  
  document.getElementById("showText").value = "【模式分解】\r\r分解:\r\r"+ result;
}
/*模式分解的交互界面End*/
//*************模式分解【End】****************


//*************生成sql语句【Start】****************
//sql语句生成函数
function generateSql(table, primaryKey, foreignKey) {
  let sqlStr = 'CREATE TABLE ' + primaryKey + ' (\n';
  let primaryKeyArr = [];
  primaryKeyArr = extractChar(primaryKey); //将主键拆分成独立的字符
  for(let i=0; i<primaryKeyArr.length; i++) {
    sqlStr += '  ' + primaryKeyArr[i] + ' int(50)' + ',\n';
  }
  for(let i=0; i<table.length; i++) {
    if(primaryKey.indexOf(table[i]) == -1) { 
      sqlStr += '  ' + table[i] + ' varchar(50)' + ' not null,\n';
    }
  }
  sqlStr += '  primary key('
  for(let i=0; i<primaryKeyArr.length; i++) {
    sqlStr += primaryKeyArr[i];
    if(i < primaryKeyArr.length-1) {
      sqlStr += ',';
    }
  }
  sqlStr += ')\n)\n\n';
  
  return sqlStr;
}

//显示sql生成结果
function showSql() {
  let sqlDatas = document.getElementById('sqlDatas').value;
  if(sqlDatas == '') {
    document.getElementById('generateSqlDiv').value = '无法生成sql，请先进行模式分解！';
  } else {
    document.getElementById('generateSqlDiv').value = sqlDatas;
  }
}
//*************生成sql语句【End】****************