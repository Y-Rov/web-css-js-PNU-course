(function (global) {

    let ns = {};

    const ALL_CATEGORIES_URL = "data/categories.json";
    const CATALOG_ITEMS_URL = "data/catalog/";

    const HOME_STATIC_CONTENT_HTML = "snippets/home-snippet.html";
    const CATEGORIES_TITLE_HTML = "snippets/categories-title-snippet.html";
    const CATEGORY_HTML = "snippets/category-snippet.html";

    const CATALOG_ITEMS_TITLE_HTML = "snippets/catalog-items-title-snippet.html";
    const CATALOG_ITEM_PREVIEW_HTML = "snippets/catalog-item-preview-snippet.html";

    const ITEM_HTML = "snippets/item-snippet.html";

    const ABOUT_US_HTML = "snippets/about_us-snippet.html";

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

    let switchCatalogToActive = function (selectedItem) {
        removeAllActiveSelectors();

        let classes = document.querySelector("#navbarDropdown").className;
        classes += " active";
        document.querySelector("#navbarDropdown").className = classes;

        classes = document.querySelector("#nav" + selectedItem).className;
        classes += " active";
        document.querySelector("#nav" + selectedItem).className = classes;
    };

    let switchAboutUsToActive = function () {
        removeAllActiveSelectors();

        let classes = document.querySelector("#navAboutUsButton").className;
        classes += " active";
        document.querySelector("#navAboutUsButton").className = classes;
    };

    let removeAllActiveSelectors = function() {
        document.querySelectorAll(".active").forEach(function (item) {
            item.className = item.className.replace(new RegExp("active", "g"), "");
        });
    };

    document.addEventListener("DOMContentLoaded", function (event) {
        showLoading("#content");
        $ajaxUtils
            .sendGetRequest(
                ALL_CATEGORIES_URL,
                function (categories) {
                    $ajaxUtils.sendGetRequest(
                        HOME_STATIC_CONTENT_HTML,
                        function (homeStaticHtml) {
                            $ajaxUtils.sendGetRequest(
                                CATEGORIES_TITLE_HTML,
                                function (categoriesTitleHtml) {
                                    $ajaxUtils.sendGetRequest(
                                        CATEGORY_HTML,
                                        function (categoriesHtml) {
                                            let homeHtmlView =
                                                buildHomeViewHtml(
                                                    categories,
                                                    homeStaticHtml,
                                                    categoriesTitleHtml,
                                                    categoriesHtml
                                                );
                                            insertHtml("#content", homeHtmlView);
                                        },
                                        false);
                                },
                                false);
                        },
                        false);
                });

    });

    function buildHomeViewHtml(categories, homeStaticContent, categoriesTitleHtml, categoryHtml) {
        let finalHtml = homeStaticContent;
        finalHtml += categoriesTitleHtml;
        finalHtml += "<div class='container'>";
        finalHtml += "<section class='row'>";

        for (let i = 0; i < categories.length; i++) {
            let html = categoryHtml;
            let name = "" + categories[i].name;
            html = insertProperty(html, "name", name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        finalHtml += "</div>";
        return finalHtml;
    }

    ns.loadCategoryItems = function (categoryName) {
        showLoading("#content");
        switchCatalogToActive(categoryName);
        $ajaxUtils.sendGetRequest(
            CATALOG_ITEMS_URL + categoryName + ".json",
            buildAndShowCatalogItemsHTML);
    };

    function buildAndShowCatalogItemsHTML(categoryCatalogItems) {
        $ajaxUtils.sendGetRequest(
            CATALOG_ITEMS_TITLE_HTML,
            function (catalogItemsTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    CATALOG_ITEM_PREVIEW_HTML,
                    function (catalogItemPreviewHtml) {
                        let catalogItemsViewHtml = buildCatalogItemsViewHtml(
                            categoryCatalogItems,
                            catalogItemsTitleHtml,
                            catalogItemPreviewHtml);
                        insertHtml("#content", catalogItemsViewHtml);
                    },
                    false);
            },
            false);
    }

    function buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemPreviewHtml) {
        catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "name", categoryCatalogItems.category.name);
        catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "notes", categoryCatalogItems.category.notes);

        let finalHtml = catalogItemsTitleHtml;
        finalHtml += "<div class='container'>";
        finalHtml += "<section class='row'>";

        let catalogItems = categoryCatalogItems.catalog_items;
        let categoryShortName = categoryCatalogItems.category.short_name;

        for (let i = 0; i < catalogItems.length; i++) {
            let html = catalogItemPreviewHtml;
            html = insertProperty(html, "short_name", catalogItems[i].short_name);
            html = insertProperty(html, "name", catalogItems[i].name);
            html = insertProperty(html, "id", catalogItems[i].id);
            html = insertItemPrice(html, "price_for_are", catalogItems[i].price_for_are);
            html = insertProperty(html, "categoryShortName", categoryShortName);
            html = insertItemArea(html, "area_in_are", catalogItems[i].area_in_are);

            finalHtml += html;
        }

        finalHtml += "</section>";
        finalHtml += "</div>";
        return finalHtml;
    }

    let insertItemPrice = function (html, pricePropName, priceValue) {

        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }

        priceValue = priceValue.toFixed(2) + " $/are";
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    };

    let insertItemArea = function (html, areaPropName, areaValue) {

        if (!areaValue) {
            return insertProperty(html, areaPropName, "");
        }

        areaValue = areaValue.toFixed(2) + " ares";
        html = insertProperty(html, areaPropName, areaValue);
        return html;
    };

    ns.loadItem = function (categoryShortName, id) {
        showLoading("#content");
        $ajaxUtils.sendGetRequest(
            CATALOG_ITEMS_URL + categoryShortName + ".json",
            function (categoryItems) {
                $ajaxUtils.sendGetRequest(
                    ITEM_HTML,
                    function (itemHtml) {
                        let itemsViewHtml = buildItemViewHtml(
                            categoryItems,
                            id,
                            itemHtml);
                        insertHtml("#content", itemsViewHtml);
                    },
                    false);
            });
    };

    function buildItemViewHtml(categoryItems, itemToDisplayId, itemHtml) {
        let finalHtml = itemHtml;

        let catalogItems = categoryItems.catalog_items;
        let categoryShortName = categoryItems.category.short_name;

        for (let i = 0; i < catalogItems.length; i++) {
            if (catalogItems[i].id == itemToDisplayId) {
                finalHtml = insertProperty(finalHtml, "categoryShortName", categoryShortName);
                finalHtml = insertProperty(finalHtml, "short_name", catalogItems[i].short_name);
                finalHtml = insertProperty(finalHtml, "name", catalogItems[i].name);
                finalHtml = insertProperty(finalHtml, "description", catalogItems[i].description);
                finalHtml = insertItemArea(finalHtml, "area_in_are", catalogItems[i].area_in_are);
                finalHtml = insertProperty(finalHtml, "cadastral_number", catalogItems[i].cadastral_number);
                finalHtml = insertProperty(finalHtml, "lat", catalogItems[i].lat);
                finalHtml = insertProperty(finalHtml, "lon", catalogItems[i].lon);
                finalHtml = insertItemPrice(finalHtml, "price_for_are", catalogItems[i].price_for_are);
                return finalHtml;
            }
        }
    }

    ns.loadAboutUsPage = function () {
        showLoading("#content");
        $ajaxUtils.sendGetRequest(
            ABOUT_US_HTML,
            function (aboutUsHtml) {
                switchAboutUsToActive();
                insertHtml("#content", aboutUsHtml);
            },
            false);
    }
    ns.getCalculate = function(){
        let a = document.getElementById("floatingInputM").value;
        let b = document.getElementById("floatingInputP").value;
        if(typeof(parseFloat(a)) == "number" && typeof(parseFloat(b)) == "number"){
            if(a >= 0 && b>= 0){
                document.getElementById("result").innerText = "Result price: " + a*b + "$";
            }else{
                document.getElementById("result").innerText = "Some of the parameters are not numbers or negative";
            }
        }
        else{
            document.getElementById("result").innerText = "Some of the parameters are not numbers";
        }
    }



    global.$ns = ns;



})(window);