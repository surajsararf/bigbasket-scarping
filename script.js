function loadMenu(){
 var ui=SpreadsheetApp.getUi();
  ui.createMenu('Scrap Data').addItem('fetch category and Brnad', 'fetchCategories').addItem('fetch product', 'fetchProducts').addToUi();
}

function fetchCategories() {
  var options = {headers:{"User-Agent":"PostmanRuntime/7.25.0",
                          "Accept":"*/*",
                          "origin":"https://www.bigbasket.com",
                          "Cookie":'_bb_locSrc=default; _sp_van_encom_hid=1722; _bb_cid=1; _bb_hid=1723; _sp_bike_hid=1720; _bb_vid="NDEwNDI3NDM1MQ=="; _bb_tc=0; _client_version=2298; _bb_aid="MzAwNDkxOTI2MA=="; _bb_rdt="MzE0MzEyNTMxNw==.0"; _bb_rd=6; sessionid=t8l0c11worovurcsxl52zt68uczlnhiy; ts="2020-06-23 14:21:32.692"'}};
 var response = UrlFetchApp.fetch("https://www.bigbasket.com/auth/get_menu/?city_id=1",options);
  var json = response.getContentText();
  var data=JSON.parse(json);
  var sheet = SpreadsheetApp.getActive().getSheetByName("brands");
       sheet.getRange(2,2,1500,10).clearContent();
  findCategory(data);
}

function findCategory(json){

   var sheet = SpreadsheetApp.getActive().getSheetByName("categories");
     sheet.getRange(2,2,1500,10).clearContent();
      var last=2;
  for(var i=0;i<json["topcats"].length;i++){
    var elem=json["topcats"][i];
    sheet.getRange(last,2).setValue(last-1);
    sheet.getRange(last,3).setValue(elem["top_category"]["name"]);
    sheet.getRange(last,4).setValue('-');
    sheet.getRange(last,5).setValue(elem["top_category"]["slug"]);
    brands(elem["top_category"],last-1);
    findSubCategory(elem,elem["top_category"]["name"]);
    last=sheet.getLastRow()+1;
  }
}

function brands(json,id){
  var sheet = SpreadsheetApp.getActive().getSheetByName("brands");
  var last=sheet.getLastRow()+1;
  for(var i=0;i<json["brands"].length;i++) {
    var elem=json["brands"][i];
    sheet.getRange(last,2).setValue(last-1);
    sheet.getRange(last,3).setValue(elem["brand_name"]);
    sheet.getRange(last,4).setValue(elem["brand_slug"]);
    sheet.getRange(last,6).setValue(elem["brand_id"]);
    sheet.getRange(last,7).setValue(id);
    last++;
  }
}

function findSubCategory(json, parent){
   var sheet = SpreadsheetApp.getActive().getSheetByName("categories");
  var last=sheet.getLastRow()+1;
  for(var i=0;i<json["sub_cats"][0].length;i++) {
    var elem=json["sub_cats"][0][i];
    sheet.getRange(last,2).setValue(last-1);
    sheet.getRange(last,3).setValue(elem["sub_category"][0]);
    sheet.getRange(last,4).setValue(parent);
    sheet.getRange(last,5).setValue(elem["sub_category"][1]);
    findSubSubCategory(elem, elem["sub_category"][0])
    last=sheet.getLastRow()+1;
  }
}

function findSubSubCategory(json, parent){
   var sheet = SpreadsheetApp.getActive().getSheetByName("categories");
  var last=sheet.getLastRow()+1;
  for(var i=0;i<json["cats"].length;i++) {
    var elem=json["cats"][i]["cat"];
    sheet.getRange(last,2).setValue(last-1);
    sheet.getRange(last,3).setValue(elem[0]);
    sheet.getRange(last,4).setValue(parent);
    sheet.getRange(last,5).setValue(elem[1]);
    last++;
  }
}

function fetchProducts() {
  var options = {headers:{"User-Agent":"PostmanRuntime/7.25.0",
                          "Accept":"*/*",
                          "origin":"https://www.bigbasket.com",
                          "Cookie":'_bb_locSrc=default; _sp_van_encom_hid=1722; _bb_cid=1; _bb_hid=1723; _sp_bike_hid=1720; _bb_vid="NDEwNDI3NDM1MQ=="; _bb_tc=0; _client_version=2298; _bb_aid="MzAwNDkxOTI2MA=="; _bb_rdt="MzE0MzEyNTMxNw==.0"; _bb_rd=6; sessionid=t8l0c11worovurcsxl52zt68uczlnhiy; ts="2020-06-23 14:21:32.692"'}};
  var cateSheet = SpreadsheetApp.getActive().getSheetByName("categories");
  var last=2;
  var cateSlug=cateSheet.getRange(last, 5).getValue();
  
  var isOld=false;
  var cacheSheet = SpreadsheetApp.getActive().getSheetByName("cache");
  if(cacheSheet.getLastRow()!=1){
    var status=cacheSheet.getRange(cacheSheet.getLastRow(), 4).getValue();
    if(status!=='COMPLETED'){
      last=cacheSheet.getRange(cacheSheet.getLastRow(), 1).getValue();
      cateSlug=cacheSheet.getRange(cacheSheet.getLastRow(), 2).getValue();
      isOld=true;
    }
    else{
      last=cacheSheet.getRange(cacheSheet.getLastRow(), 1).getValue()+1;
      cateSlug=cateSheet.getRange(last, 5).getValue();
    }
  }
  
  while(cateSlug && cateSlug.length>0){
    fetchProductList(cateSlug,last,isOld);
    last++;
    isOld=false;
    cateSlug=cateSheet.getRange(last, 5).getValue();
    Logger.log(cateSlug,last);
  }
}


function fetchProductList(cateSlug,cateline,isOld){

  var i=1;
  if(isOld){
    var cacheSheet = SpreadsheetApp.getActive().getSheetByName("cache");
    i = cacheSheet.getRange(cacheSheet.getLastRow(), 3).getValue();
  }
  var options = {headers:{"User-Agent":"PostmanRuntime/7.25.0",
                          "Accept":"*/*",
                          "origin":"https://www.bigbasket.com",
                          "Cookie":'_bb_locSrc=default; _sp_van_encom_hid=1722; _bb_cid=1; _bb_hid=1723; _sp_bike_hid=1720; _bb_vid="NDEwNDI3NDM1MQ=="; _bb_tc=0; _client_version=2298; _bb_aid="MzAwNDkxOTI2MA=="; _bb_rdt="MzE0MzEyNTMxNw==.0"; _bb_rd=6; sessionid=t8l0c11worovurcsxl52zt68uczlnhiy; ts="2020-06-23 14:21:32.692"'}};
 
  while(i>0) {
      var url="https://www.bigbasket.com/product/get-products/?slug=" + cateSlug + "&page="+i+"&tab_type=[%22all%22]&sorted_on=popularity&listtype=pc";
    var response
    try{
      response = UrlFetchApp.fetch(url,options);
  }
  catch(e){
        var errorSheet = SpreadsheetApp.getActive().getSheetByName("error");
            errorSheet.getRange(errorSheet.getLastRow()+1, 1).setValue(url);
                errorSheet.getRange(errorSheet.getLastRow()+1, 2).setValue(e);
    
    i++;
    continue;
  }
    var json = response.getContentText();
    var data = JSON.parse(json);
        Logger.log("page",i,url,data);
    if(i==1){
      var pro=data["tab_info"];
      pro=pro[0]["product_info"];
      pro=pro["products"];
      if(pro && pro.length>0){
        findProductId(pro,cateSlug,cateline,i,isOld);
        Logger.log("page",i,"done");
      }
      else{
        i==-1;
        break;
      }
    }
    else{
       Logger.log("page",i,"page");
       var pro=data['tab_info']['product_map']['all']['prods'];
       Logger.log("page",i,pro);
      if(pro && pro.length>0){
        findProductId(pro,cateSlug,cateline,i,isOld);
        Logger.log("page",i,"done");
      }
      else{
        i==-1;
        break;
      }
    }
    i++;
  }
}

function findProductId(pro,cateSlug,cateline,page,isOld){
  var cacheSheet = SpreadsheetApp.getActive().getSheetByName("cache");
    var productSheet = SpreadsheetApp.getActive().getSheetByName("products");
  var clast=cacheSheet.getLastRow()+1;
  if(isOld){
    clast=cacheSheet.getLastRow();
  }
  var last=productSheet.getLastRow()+1;

  cacheSheet.getRange(clast,1).setValue(cateline);
    cacheSheet.getRange(clast,2).setValue(cateSlug);
    cacheSheet.getRange(clast,3).setValue(page);

      cacheSheet.getRange(clast,4).setValue("Progess");
    if(!isOld){
      cacheSheet.getRange(clast,6).setValue(0);
      cacheSheet.getRange(clast,5).setValue(last);
    }
  
  var startfrom =0;
  if(isOld){
    startfrom = cacheSheet.getRange(clast,6).getValue()-1;
    if(startfrom<0){
      startfrom=0;
    }
  }

  for(var i=startfrom;i<pro.length;i++){
    var product=pro[i];
    last=productSheet.getLastRow()+1;
    productSheet.getRange(last, 4).setValue(product.sku);
    productSheet.getRange(last, 17).setValue(product.p_img_url);
    getProductDetail(last,product.sku);
    cacheSheet.getRange(clast,6).setValue(i+1);
    cacheSheet.getRange(clast,7).setValue(new Date());
    if(i==pro.length-1){
         cacheSheet.getRange(clast,4).setValue("COMPLETED");
    }
  }
}

function getProductDetail(row,id){
    var productSheet = SpreadsheetApp.getActive().getSheetByName("products");
  var options = {headers:{"User-Agent":"PostmanRuntime/7.25.0",
                          "Accept":"*/*",
                          "origin":"https://www.bigbasket.com",
                          "Cookie":'_bb_locSrc=default; _sp_van_encom_hid=1722; _bb_cid=1; _bb_hid=1723; _sp_bike_hid=1720; _bb_vid="NDEwNDI3NDM1MQ=="; _bb_tc=0; _client_version=2298; _bb_aid="MzAwNDkxOTI2MA=="; _bb_rdt="MzE0MzEyNTMxNw==.0"; _bb_rd=6; sessionid=t8l0c11worovurcsxl52zt68uczlnhiy; ts="2020-06-24 11:00:15.069"'}};
  var url="https://www.bigbasket.com/product/pd/v1/detail/"+id;
   var response;
  try{
  response = UrlFetchApp.fetch(url,options);
  }
  catch(e){
        var errorSheet = SpreadsheetApp.getActive().getSheetByName("error");
            errorSheet.getRange(errorSheet.getLastRow()+1, 1).setValue(url);
                errorSheet.getRange(errorSheet.getLastRow()+1, 2).setValue(e);
    return;
  }
    var json = response.getContentText();
    var data = JSON.parse(json).response;
  writeProduct(row,id,data,url,'');
    if(data.children){
  for(var k=0;k<data.children.length;k++){
        var child=data.children[k];
    writeProduct(row+k+1,child.id,child,"https://www.bigbasket.com/product/pd/v1/detail/" + child.id,id);
  }
    }
}


function writeProduct(row,id,data,url,parent){
  var productSheet = SpreadsheetApp.getActive().getSheetByName("products");
  productSheet.getRange(row, 3).setValue(row-1);
        productSheet.getRange(row, 4).setValue(id);
        productSheet.getRange(row, 5).setValue(data.desc);
        productSheet.getRange(row, 6).setValue(data.w);
        productSheet.getRange(row, 7).setValue(data.category.tlc_name);
        productSheet.getRange(row, 8).setValue(data.category.tlc_slug);
        productSheet.getRange(row, 9).setValue(data.category.llc_name);
        productSheet.getRange(row, 10).setValue(data.category.llc_slug.replace("type=pc","").replace("&slug=","").replace("type=pc&slug=",""));
          productSheet.getRange(row, 14).setValue(data.brand.slug);
          productSheet.getRange(row, 15).setValue(data.brand.name);
          productSheet.getRange(row, 16).setValue(JSON.stringify(data.images));
          productSheet.getRange(row, 18).setValue(data.mrp);
          productSheet.getRange(row, 19).setValue(data.sp);
          productSheet.getRange(row, 20).setValue(JSON.stringify(data.tabs));
          productSheet.getRange(row, 21).setValue(data.pack_desc);
       productSheet.getRange(row, 22).setValue(url);
  if(data.tags && data.tags[0] && data.tags[0].values){
       productSheet.getRange(row, 23).setValue(data.tags[0].values.display_name);
  }

  var children='';
  if(data.children){
  for(var i=0;i<data.children.length;i++){
    children+=data.children[i].id+',';
  }
  }
   productSheet.getRange(row, 24).setValue(children);  
  productSheet.getRange(row, 25).setValue(parent);
    productSheet.getRange(row, 26).setValue(new Date());
}

function clearProducts(){
    var productSheet = SpreadsheetApp.getActive().getSheetByName("products");
  //productSheet.getRange(2, 2,1000,100).clear();
}

function recreateImageUrl(){
  var ss="https://www.bigbasket.com/media/uploads";
}
