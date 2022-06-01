// noinspection DuplicatedCode

(function (global){
  let ajax = {};

  const HOME_HTML = "snippets/home-snippet.html";
  const ALL_CATEGORIES_URL = "data/categories.json";
  const CATEGORIES_TITLE_HTML = "snippets/categories-title-snippet.html";
  const CATEGORY_HTML = "snippets/category-snippet.html";
  const CATALOG_ITEMS_URL = "data/catalog/";
  const CATALOG_ITEMS_TITLE_HTML = "snippets/catalog-items-title.html";
  const CATALOG_ITEM_HTML = "snippets/catalog-item.html";

  let insertHtml = function (selector, html) {
    let targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  let showLoading = function (selector) {
    let html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif' alt='loading' /></div>";
    insertHtml(selector, html);
  };

  let insertProperty = function (string, propName, propValue) {
    let propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  let switchCatalogToActive = function () {
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navCatalogButton").className;
    if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navCatalogButton").className = classes;
    }

  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        HOME_HTML,
        function (responseText) {
          document.querySelector("#main-content").innerHTML = responseText;
        },
        false);
  });

  ajax.loadCatalogCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        ALL_CATEGORIES_URL,
        buildAndShowCategoriesHTML);
  };

  ajax.loadCatalogItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        CATALOG_ITEMS_URL + categoryShort + ".json",
        buildAndShowCatalogItemsHtml);
  };

  ajax.loadRandomItems = function () {
    showLoading("#main-content");
    let randomCategoryJSON = ["B", "C", "G", "T"];
    const random = Math.floor(Math.random() * randomCategoryJSON.length);
    $ajaxUtils.sendGetRequest(
        CATALOG_ITEMS_URL + randomCategoryJSON[random] + ".json",
        buildAndShowCatalogItemsHtml);
  }

  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(
        CATEGORIES_TITLE_HTML,
        function (CATEGORIES_TITLE_HTML) {
          $ajaxUtils.sendGetRequest(
              CATEGORY_HTML,
              function (CATEGORY_HTML) {
                switchCatalogToActive();
                let categoriesViewHtml =
                    buildCategoriesViewHtml(categories,
                        CATEGORIES_TITLE_HTML,
                        CATEGORY_HTML);
                insertHtml("#main-content", categoriesViewHtml);
              },
              false);
        },
        false);
  }

  function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {

    let finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    for (let i = 0; i < categories.length; i++) {
      let html = categoryHtml;
      let name = "" + categories[i].name;
      let shortname = categories[i].shortname;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "shortname", shortname);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  function buildAndShowCatalogItemsHtml(categoryCatalogItems) {
    $ajaxUtils.sendGetRequest(
        CATALOG_ITEMS_TITLE_HTML,
        function (catalogItemsTitleHtml) {
          $ajaxUtils.sendGetRequest(
              CATALOG_ITEM_HTML,
              function (catalogItemHtml) {
                let catalogItemsViewHtml = buildCatalogItemsViewHtml(categoryCatalogItems,
                    catalogItemsTitleHtml,catalogItemHtml);
                insertHtml("#main-content", catalogItemsViewHtml);
              },
              false);
        },
        false);
  }

  function buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemHtml) {
    catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "name", categoryCatalogItems.category.name);
    catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "notes", categoryCatalogItems.category.notes);

    let finalHTML = catalogItemsTitleHtml;
    finalHTML += "<section class='row'>";

    let catalogItems = categoryCatalogItems.catalog_items;
    let catShortName = categoryCatalogItems.category.shortname;

    for (let i = 0; i < catalogItems.length; i++) {
      let html = catalogItemHtml;
      html = insertProperty(html, "shortname", catalogItems[i].shortname);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertProperty(html, "name", catalogItems[i].name);
      html = insertProperty(html, "description", catalogItems[i].description);
      html = insertItemPrice(html, "price", catalogItems[i].price);
      finalHTML += html;
    }

    finalHTML += "</section>";
    return finalHTML;
  }

  function insertItemPrice(html,
                           pricePropName,
                           priceValue) {
    // if (!priceValue) {
    //   return insertProperty(html, pricePropName, "");
    // }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  global.$ajax = ajax;

})(window)