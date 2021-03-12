//*************求闭包【Start】****************
//求所有组合
function allCombinations(strArr, index=0, group=[]) {
    var need_apply = [];
    need_apply.push(strArr[index]);
    for(var i = 0; i < group.length; i++) {
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
    var combArr = [];
    var allCombArr = allCombinations(strArr);
    for (var i=0; i<allCombArr.length; i++) {
        combArr = allCombinations(allCombArr[i]);
        for (var j=0; j<combArr.length; j++) {
            closureReflectArr.push(allCombArr[i] + '->' + combArr[j]);
        }
    }
    return closureReflectArr;
}

//将字符串中的字符提取出来单独存入数组中
function extractChar(str) {
    var strArr = []; //用于接收allDependenceArr中包含的所有的字母
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
    var leftArr = [];
    var str = '';
    for (var i=0; i<allDependenceArr.length; i++) {
        var c = undefined;
        for (var j=0; j<allDependenceArr[i].length; j++) {
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
    var rightArr = [];
    var tempArr = [];
    for (var i=0; i<allDependenceArr.length; i++) {
        rightArr.push((allDependenceArr[i].split(/-->|->|-/g))[1]); //以-->或->或-为分隔符，并把右边部分存入数组
    }

    return rightArr;
}

//按字母大小顺序插入
function insertStr(str, character) {
    var i = undefined;
    var position = undefined;
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
    var closureAugmentArr = [];
    
    //存依赖关系的左半部分
    var leftArr = leftDependence(allDependenceArr);
    //存依赖关系的右半部分
    var rightArr = rightDependence(allDependenceArr);
    
    //求扩展部分
    closureAugmentArr = closureAugmentArr.concat(allDependenceArr);
    for (var i=0; i<leftArr.length; i++) {
        //求出F中每个依赖关系左半部分的全排列，再与其右半部分进行组合
        var leftStrArr = extractChar(leftArr[i]);
        var allCombArr = allCombinations(leftStrArr); 
        for (var j=0; j<allCombArr.length; j++) {
            closureAugmentArr.push(leftArr[i] + '->' + (allCombArr[j]+rightArr[i]).split('').sort().join(''));
        }
    }

    for (var i=0; i<leftArr.length; i++) {
        for (var j=0; j<strArr.length; j++) {
            //找到strArr中不在当前依赖关系中的字母，进行扩展
            if (!leftArr[i].includes(strArr[j]) && !rightArr[i].includes(strArr[j])) {
                var str1 = insertStr(leftArr[i], strArr[j]);
                var newDependence = str1 + '->' + rightArr[i];
                //去除重复依赖
                if (!closureAugmentArr.includes(newDependence)) {
                    leftArr.push(str1);
                    rightArr.push(rightArr[i]);
                    closureAugmentArr.push(newDependence);
                }
                var str2 = insertStr(rightArr[i], strArr[j]);
                newDependence = str1 + '->' + str2;
                if (!closureAugmentArr.includes(newDependence)) { 
                    leftArr.push(str1);
                    rightArr.push(str2);
                    closureAugmentArr.push();
                }
            } 
            //找到strArr中在依赖左边但不在依赖右边的字母，进行扩展
            if (leftArr[i].includes(strArr[j]) && !rightArr[i].includes(strArr[j])) {
                var str = insertStr(rightArr[i], strArr[j]);
                var newDependence = leftArr[i] + '->' + str;
                if (!closureAugmentArr.includes(newDependence)) {                
                    leftArr.push(leftArr[i]);
                    rightArr.push(str);
                    closureAugmentArr.push(newDependence);   
                }
            }
            //找到strArr中在依赖右边但不在依赖左边的字母，进行扩展
            if (!leftArr[i].includes(strArr[j]) && rightArr[i].includes(strArr[j])) {
                var str = insertStr(leftArr[i], strArr[j]);
                var newDependence = str + '->' + rightArr[i];
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
  var results=[],
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
    var leftArr = leftDependence(allDependenceArr);
    var rightArr = rightDependence(allDependenceArr);
    var indexArr = []; //用于存放存在传递依赖的索引
    var closureTransitiveArr = [];
    
    var tempArr = [].concat(allDependenceArr); //数组克隆
    for (var i=0; i<rightArr.length; i++) {
        indexArr = findAll(leftArr, rightArr[i]);
        for (var j=0; j<indexArr.length; j++) {
            //如果依赖关系重复则不添加
            var dependence = leftArr[i] + '->' + rightArr[indexArr[j]];
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
    var str = '';
    var allDependenceArr = [];
    for (var i=0; i<strF.length; i++) {
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
    var closureArr = []; //用于存闭包
    
    // //求反射
    // var closureReflectArr = closureReflect(strArr);
    // closureArr = closureArr.concat(closureReflectArr);
    //求扩展
    var closureAugmentArr = closureAugment(allDependenceArr, strArr);
    closureArr = closureArr.concat(closureAugmentArr);
    //求传递依赖
    var closureTransitiveArr = closureTransitive(closureArr);
    closureArr = closureArr.concat(closureTransitiveArr);
    
    return closureArr;
}

//打印闭包
function closurePrint(strF) {
    var allDependenceArr = allDependence(strF); //从字符串中提取出依赖关系存入数组
    var str = allDependenceArr.join('');
    var strArr = extractChar(str); //提取str中所含有的字符（不重复） 
    var closureText = 'F+ = {';
    closureText = closureText.concat(closure(allDependenceArr, strArr))
    closureText = closureText.concat('}');
    
    return closureText;
}

//对输入的依赖集合进行预处理
function pretreatment(strF) {
    var tempArr = [];
    var reg = /[a-zA-Z->,]/;
    for (var i=0; i<strF.length; i++) {
        if (reg.test(strF[i])) {
            tempArr.push(strF[i]);
        }
    }
    return tempArr.join('');
}

//求增广的交互界面
function closureAugmentPrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    var allDependenceArr = allDependence(content);
    result = closureAugment(allDependenceArr, extractChar(content)); 
    document.getElementById("showText").value ="【求增广】\r结果为："+ result;
}
//求传递的交互界面
function closureTransitivePrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    var allDependenceArr = allDependence(content);
    result = closureTransitive(allDependenceArr); 
    document.getElementById("showText").value ="【求传递】\r结果为："+ result;
}
//求闭包的交互界面
function closureInterface() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    result = closurePrint(content); 
    document.getElementById("showText").value ="【求闭包】\r结果为："+ result;
}
//*************求闭包【End】****************


//*************求约减【Start】****************
//求分解
function decomposeDependence(allDependenceArr) {
   var leftArr = leftDependence(allDependenceArr);
   var rightArr = rightDependence(allDependenceArr);
   var decomposeDependenceArr = []; //存入分解后的依赖关系
   
   for (var i=0; i<rightArr.length; i++) {
       if (rightArr[i].length > 1) {
           for (var j=0; j<rightArr[i].length; j++) {
               var str = leftArr[i] + '->' + rightArr[i][j];
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
    var j = undefined;
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
//去除多余依赖
function reduceRedundant(decomposeDependenceArr) {
    var reduceRedundantArr = [].concat(decomposeDependenceArr);
    var str = decomposeDependenceArr.join('');
    var strArr = extractChar(str); //提取str中所含有的字符（不重复） 
    
    if (decomposeDependenceArr.length <= 1) {
        return reduceRedundantArr;
    }
    var length = decomposeDependenceArr.length;
    var n = 0; //记录去除的依赖数
    var referClosureArr = closure(decomposeDependenceArr, strArr); //求decomposeDependenceArr的闭包,用于参考
   
    for (var i=0; i<length-n; i++) {
        //tempArr用于存入reduceRedundantArr中不包含下标为i的元素
        var tempArr = reduceRedundantArr.slice(0, i).concat(reduceRedundantArr.slice(i+1,));
        var tempClosureArr = closure(tempArr, strArr); //求去除了decomposeDependenceArr中下标为i的元素后的集合的闭包
        if (isSameContent(referClosureArr, tempClosureArr)) {
            reduceRedundantArr = tempArr;
            n++;
            i--;
        }
    }  
   
    return reduceRedundantArr;
}
//去除不相干的属性
function reduceExtraneous(reduceRedundantArr) {
    var leftArr = leftDependence(reduceRedundantArr);
    var rightArr = rightDependence(reduceRedundantArr);
    var length = reduceRedundantArr.length;
    var tempArr = [].concat(reduceRedundantArr);
    var reduceExtraneousArr = [].concat(tempArr);
    //求reduceRedundantArr的闭包,用于参考
    var referClosureArr = closure(reduceRedundantArr, extractChar(reduceRedundantArr.join(''))); 
    
    var n = 0; //记录添加的依赖数
    var flag = 0; //用于标记当前依赖的属性是否被约减，0表示未约减,1表示已约减
    var allCombArr = undefined;
    for (var i=0; i<length+n; i++) {
        if (leftArr[i].length <= 1) {
            continue;
        }
        
        allCombArr = allCombinations(extractChar(leftArr[i]));
        for (var j=0; j<allCombArr.length-1; j++) {
            tempArr[i] = allCombArr[j] + '->' + rightArr[i];
            //求替换了tempArr中下标为i的元素后的集合的闭包
            var compareClosureArr = closure(tempArr, extractChar(tempArr.join(''))); 
            if (isSameContent(referClosureArr, compareClosureArr)) {
                if (!reduceExtraneousArr.includes(allCombArr[j])) {    
                    leftArr.push(allCombArr[j]);
                    rightArr.push(rightArr[i]);
                    tempArr.push(allCombArr[j] + '->' + rightArr[i]);
                    reduceExtraneousArr.push(allCombArr[j] + '->' + rightArr[i]);
                    flag = 1;
                    n++;
                }
            }
        }
        //如果当前依赖可约减，则在去除不相干属性后将当前依赖去除
        if (flag) {
            leftArr.splice(i, 1);
            rightArr.splice(i, 1);
            tempArr.splice(i, 1);
            reduceExtraneousArr.splice(i, 1);
            i--;
            n--;
            flag = 0;
        } else {
            tempArr[i] = reduceExtraneousArr[i];
        }
    }
    return reduceExtraneousArr;
}

//约减
function reduceDependence(allDependenceArr) {
    var reduceDependenceArr = [];
    var decomposeDependenceArr = decomposeDependence(allDependenceArr);
    var reduceRedundantArr = reduceRedundant(decomposeDependenceArr);
    // reduceDependenceArr = reduceDependenceArr.concat(reduceRedundantArr);
    var reduceExtraneousArr = reduceExtraneous(reduceRedundantArr);
    reduceDependenceArr = reduceDependenceArr.concat(reduceExtraneousArr);
    
    return reduceDependenceArr;
}
//打印约减结果
function reduceDependencePrint(strF) {
    var allDependenceArr = allDependence(strF);
    var reduceDependenceArr = reduceDependence(allDependenceArr);
    
    return reduceDependenceArr;
}

//分解依赖的交互界面
function decomposeDependencePrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    var allDependenceArr = allDependence(content);
    result = decomposeDependence(allDependenceArr); 
    document.getElementById("showText").value ="【分解依赖】\r结果为："+ result;
}
//去除多余依赖的交互界面
function reduceRedundantPrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    var allDependenceArr = allDependence(content);
    result = reduceRedundant(allDependenceArr); 
    document.getElementById("showText").value ="【去除多余依赖】\r结果为："+ result;
}
//去除多余属性的交互界面
function reduceExtraneousPrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    var allDependenceArr = allDependence(content);
    result = reduceExtraneous(allDependenceArr); 
    document.getElementById("showText").value ="【去除多余属性】\r结果为："+ result;
}
//求约减的交互界面
function reduceInterface() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    result = reduceDependencePrint(content); 
    document.getElementById("showText").value ="【求最小依赖集】\r结果为："+ result;
}
//*************求约减【End】****************


//*************求关键字【要Start】****************
//检测子串subStr中所有字母是否都在主串str中
function lettersCheck(str, subStr) {
    var subStrArr = subStr.split('');
    var n=0;
    for (var i=0; i<subStrArr.length; i++) {
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
    var attributeSetClosureArr = [];
    var leftArr = leftDependence(allDependenceArr);
    var rightArr = rightDependence(allDependenceArr);
    
    var n = 1; //每次添加属性到attribute里面n都要加1，代表新的attribute还要再重新检查一次
    for (var i=0; i<n; i++) {
        for (var j=0; j<leftArr.length; j++) {
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
    var strArr = extractChar(allDependenceArr.join('')); //R（依赖中包含的所有字符）
    var allCombArr = allCombinations(strArr); //求所有的组合，作为候选结果
    var candidateKeysArr = [];
    var decomposeDependenceArr = decomposeDependence(allDependenceArr);
    for (var i=0; i<allCombArr.length; i++) {
        var attributeSetClosureArr = attributeSetClosure(decomposeDependenceArr, allCombArr[i]);
        if (isSameContent(strArr, attributeSetClosureArr)) {
            candidateKeysArr.push(allCombArr[i]);
        }
    }
    
    return candidateKeysArr;
}

//打印候选码
function candidateKeysPrint(strF) {
    var allDependenceArr = allDependence(strF);
    var candidateKeysArr = candidateKeys(allDependenceArr);
    return candidateKeysArr;
}
//求主码的交互界面
function keyWordPrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    result = candidateKeysPrint(content); 
    document.getElementById("showText").value ="【求主码】\r结果为："+ result[0];
}
//求候选码（候选关键字）的交互界面
function candidateKeysInterface() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content); //接收进行预处理后的依赖集
    var result = '';
 
    result = candidateKeysPrint(content); 
    document.getElementById("showText").value ="【求候选码】\r结果为："+ result;
}
//*************求关键字【要End】****************


//*************模式分解【要Start】****************
//计算numberOfDecompose，即原数组中每个依赖集分解成的依赖集的数量
function calNumberOfDecompose(originalArr, finalArr) {
    var decomposeArr = [];
    //求originalArr中每个数组最终分解成的数组个数
    for (var i=0; i<originalArr.length; i++) {
        decomposeArr[i] = []; //将originalArr[i]中分解出去的所有元素都存入该数组中
        for (var j=0; j<originalArr[i].length; j++) {
            if (!finalArr[i].includes(originalArr[i][j])) {
                decomposeArr[i].push(originalArr[i][j]);
            }
        }
    }
    
    for (var i=0; i<originalArr.length; i++) {
        var n = 0;
        originalArr[i].numberOfDecompose = 1; //记录分解成的数组数量
        for (var j=0; j<finalArr.length; j++) {
            var flag = false;
            for (var k=0; k<decomposeArr[i].length; k++) {  
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
    var firstParadigmArr = [];
    firstParadigmArr[0] = [].concat(allDependenceArr);
    var leftArr = leftDependence(allDependenceArr);
    var rightArr = rightDependence(allDependenceArr);
    var key = candidateKeys(allDependenceArr)[0]; //求关键字
    var letterArr = extractChar(key);
    var foreignKey = [];
    var tempArr = [];
    var n = 0;
    tempArr[n++] = [].concat(allDependenceArr);
    
    for (var i=0; i<letterArr.length; i++) {
        if (leftArr.includes(letterArr[i])) {
            foreignKey.push(letterArr[i]);
        }
    }
    
    if (letterArr.length == 1) {
        return tempArr;
    }
    
    allDependenceArr.flag = false; //用于标记原依赖关系是否需要被分解为2NF，flase表示不需要分解
    for (var i=0; i<foreignKey.length; i++) {
        tempArr[n] = [];
        for (var j=0; j<tempArr[0].length; j++) {
            //非主属性完全函数依赖于码
            if (!key.includes(rightArr[j]) && leftArr[j] == foreignKey[i]) {
                tempArr[n].push(leftArr[j] + '->' + rightArr[j]);
                allDependenceArr.flag = true;
                
                //功能：将外键包含的传递依赖也放到新数组中去，【例如外键B对应的B->D, D->E将D->E放入】
                (function (tempArr, str) {
                    var strArr = [];
                    strArr.push(str);
                    for (var i=0; i<strArr.length; i++) {
                        for (var j=0; j<leftArr.length; j++) {
                            if (str == leftArr[j]) {
                                strArr.push(rightArr[j]);
                                tempArr[n].push(str + '->' + rightArr[j]);
                                tempArr[0].splice(j, 1);
                                leftArr.splice(j, 1);
                                rightArr.splice(j, 1);
                            }
                        }
                    }
                })(tempArr, rightArr[j]);
                
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
    for (var i=0; i<tempArr.length; i++) {
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
    var tempArr = [];
    var num = secondParadigmArr.length; //2NF的数组个数
    var flagNum = 0; //记录flag为true的数量
    //拷贝
    for (var i=0; i<num; i++) {
        tempArr[i] = [].concat(secondParadigmArr[i]);
    }
    
    var newNum = num; //用于记录3NF的数组个数
 
    for (var i=0; i<tempArr.length; i++) {        
        var key = candidateKeys(tempArr[i])[0];
        var leftArr = leftDependence(tempArr[i]);
        var rightArr = rightDependence(tempArr[i]);
        
        if (i<secondParadigmArr.length) {   
            secondParadigmArr[i].flag = false;
        }
        tempArr[newNum] = [];
        for (var j=0; j<leftArr.length; j++) {
            //1NF->2NF后分解出来的组里存的值中包含传递依赖的，仅有左值不等于当前组主码的值
            
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
        
        if (tempArr[newNum].length == 0) {
            tempArr.length--;
        } else {
            newNum++;
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
    var tempArr = [];
    var num = thirdParadigmArr.length;
    var flagNum = 0; //记录flag为true的数量
    //拷贝
    for (var i=0; i<num; i++) {
        tempArr[i] = [];
        tempArr[i] = [].concat(thirdParadigmArr[i]);
    }
    
    var newNum = num; //用于记录3NF的数组个数
    for (var i=0; i<tempArr.length; i++) {        
        var key = candidateKeys(tempArr[i])[0];
        var leftArr = leftDependence(tempArr[i]);
        var rightArr = rightDependence(tempArr[i]);
        
        if (i<thirdParadigmArr.length) {
            thirdParadigmArr[i].flag = false;
        }
        tempArr[newNum] = [];
        for (var j=0; j<leftArr.length; j++) {
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
    for (var i=0; i<tempArr.length; i++) {
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
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content);
    var result = '';
    
    var allDependenceArr = allDependence(content);
    var reduceDependenceArr = reduceDependence(allDependenceArr);
 
    var secondParadigmArr = decompose1NF(reduceDependenceArr); 
    for (var i=0; i<secondParadigmArr.length; i++) {
        if (secondParadigmArr.length > 1) {
            result += 'R' + (i+1) + '={' + extractChar(secondParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + secondParadigmArr[i] + '}, 主码为：' + candidateKeys(secondParadigmArr[i])[0] + '\r';
        } else {
            result += 'R满足2NF不需要分解。';
        }
    }
    
    document.getElementById("showText").value ="【分解为2NF】\r结果为：\r" + result;
}
//求2NF->3NF的交互界面
function decompose2NFPrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content);
    var result = '';
    
    var allDependenceArr = allDependence(content);
    var reduceDependenceArr = reduceDependence(allDependenceArr);
 
    var secondParadigmArr = decompose1NF(reduceDependenceArr); 
    var thirdParadigmArr = decompose2NF(secondParadigmArr);
    if (secondParadigmArr.flag == true) {  
        for (var i=0; i<thirdParadigmArr.length; i++) {
            result += 'R' + (i+1) + '={' + extractChar(thirdParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + thirdParadigmArr[i] + '}, 主码为：' + candidateKeys(thirdParadigmArr[i])[0] + '\r';
        }
    } else {
        result += 'R满足3NF不需要分解。';
    }
    
    document.getElementById("showText").value ="【分解为3NF】\r结果为：\r" + result;
}
//求3NF->BCNF的交互界面
function decompose3NFPrint() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content);
    var result = '';
    
    var allDependenceArr = allDependence(content);
    var reduceDependenceArr = reduceDependence(allDependenceArr);
 
    var secondParadigmArr = decompose1NF(reduceDependenceArr); 
    var thirdParadigmArr = decompose2NF(secondParadigmArr);
    var bcParadigmArr = decompose3NF(thirdParadigmArr);
    if (thirdParadigmArr.flag == true) {  
        for (var i=0; i<bcParadigmArr.length; i++) {
            result += 'R' + (i+1) + '={' + extractChar(bcParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + bcParadigmArr[i] + '}, 主码为：' + candidateKeys(bcParadigmArr[i])[0] + '\r';
        }
    } else {
        result += 'R满足BCNF不需要分解。';
    }
    
    document.getElementById("showText").value ="【分解为BCNF】\r结果为：\r" + result;
}
//模式分解的交互界面
function patternDecomposeInterface() {
	var content = document.getElementById("inputBox").value;
    content = pretreatment(content);
    var result = '';
    
    var allDependenceArr = allDependence(content);
    var reduceDependenceArr = reduceDependence(allDependenceArr);
    result += '求得最小依赖集为：R={' + extractChar(reduceDependenceArr.join('')) + '}, F={' + reduceDependenceArr + '}，主码为：' + candidateKeys(reduceDependenceArr)[0] + '\r\r'; 
    
    //输出1NF->2NF
    var No_last = 0; //用于记录分解后最后一个数组的序号
    result += '【1NF->2NF】\r';
    var secondParadigmArr = decompose1NF(reduceDependenceArr);
    if (reduceDependenceArr.flag == true) {
        result += 'R不满足2NF，可分解为';
        for (var i=0; i<secondParadigmArr.length; i++) {
            result += 'R' + (i+1);
            if (i != secondParadigmArr.length-1) {
                result += ',';
            } else {
                result += '。';
            }
        }
        result += '\r';
        
        for (var i=0; i<secondParadigmArr.length; i++) {
            result += '|| R' + (i+1) + '={' + extractChar(secondParadigmArr[i].join('')) + '}, F' + (i+1) + '={' + secondParadigmArr[i] + '}' + '，主码为：' + candidateKeys(secondParadigmArr[i])[0] + '，满足2NF' + '\r';
            No_last = i+1;
        }
    } else {
        result += 'R满足2NF，不需要分解。\r';
    }
    result += '\r';
    
    //输出2NF->3NF
    result += '【2NF->3NF】\r';
    var thirdParadigmArr = decompose2NF(secondParadigmArr);
    var num = secondParadigmArr.length;
    var m = 0;
    var No_BCNFArr = []; //用于3NF->BCNF的分解出的数组的序号计算,记录未分解的数组的序号
    var No_first = []; //用于3NF->BCNF的分解出的数组的序号计算，记录首个分解出来的新数组序号
    console.log(secondParadigmArr);
    for (var i=0; i<secondParadigmArr.length; i++) {        
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
        
        var n;
        if (secondParadigmArr.length == 1) {
            n = 0;
        } else {
            n = 1;
        }
        
        var subArr = []; //用于存储R(i)中i的值
        for (var j=0; j<secondParadigmArr[i].numberOfDecompose; j++) {
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
        for (var j=0; j<secondParadigmArr[i].numberOfDecompose-1; j++) {
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
    var bcParadigmArr = decompose3NF(thirdParadigmArr);
    num = thirdParadigmArr.length;
    for (var i=0; i<thirdParadigmArr.length; i++) {
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
                    result += 'R' + No_BCNFArr[i] + '满足BCNF，不需要分解';
                } else {   
                    result += 'R' + (No_first[0]++) + '满足BCNF，不需要分解。\r\r';
                }
            } else {
                if (i < No_BCNFArr.length) {
                    result += 'R' + No_BCNFArr[i] + '满足BCNF，不需要分解';
                } else {
                    result += 'R' + (No_first[0]++) + '满足BCNF，不需要分解；\r';
                }
            }
            continue;
        }
        
        var n;
        if (thirdParadigmArr.length == 1) {
            n = 0;
        } else {
            n = 1;
        }
        
        var subArr = []; //用于存储R(i)中i的值
        for (var j=0; j<thirdParadigmArr[i].numberOfDecompose; j++) {
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
        for (var j=0; j<thirdParadigmArr[i].numberOfDecompose-1; j++) {
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
//*************模式分解【要End】****************