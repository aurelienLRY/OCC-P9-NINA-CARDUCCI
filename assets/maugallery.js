(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      if ((options.lightBox && $(this).prop("tagName") === "IMG") ||(options.lightBox && $(this).prop("tagName") === "PICTURE"))   {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "PICTURE") {
          element.find("img").addClass("img-fluid");
      } else if (element.prop("tagName") === "IMG") {
          element.addClass("img-fluid");
      }
  }



  ,
   openLightBox(element, lightboxId) {
    var imgSrc;

    if (element.prop("tagName") === "PICTURE") {
        imgSrc = element.find("img").attr("src");
    } else if (element.prop("tagName") === "IMG") {
        imgSrc = element.attr("src");
    }

    $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", imgSrc);
    $(`#${lightboxId}`).modal("toggle");
}
,




    prevImage(lightboxId) {
      let activeImage = null;
      let currentSrc = $(`#${lightboxId}`).find(".lightboxImage").attr("src");
  
      $(".gallery-item").each(function() {
          if ($(this).prop("tagName") === "IMG" && $(this).attr("src") === currentSrc) {
              activeImage = $(this);
          } else if ($(this).prop("tagName") === "PICTURE" && $(this).find("img").attr("src") === currentSrc) {
              activeImage = $(this).find("img");
          }
      });
  
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
  
      if (activeTag === "all") {
          $(".item-column").each(function() {
              let image = $(this).children("img");
              if (image.length) {
                  imagesCollection.push(image);
              } else {
                  // Si l'image est à l'intérieur d'une balise <picture>
                  let picture = $(this).children("picture");
                  if (picture.length) {
                      imagesCollection.push(picture.find("img"));
                  }
              }
          });
      } else {
          $(".item-column").each(function() {
              let image = $(this).children("img");
              if (image.length && image.data("gallery-tag") === activeTag) {
                  imagesCollection.push(image);
              } else {
                  // Si l'image est à l'intérieur d'une balise <picture>
                  let picture = $(this).children("picture");
                  if (picture.length && picture.find("img").data("gallery-tag") === activeTag) {
                      imagesCollection.push(picture.find("img"));
                  }
              }
          });
      }
  
      let index = 0;
      let prev = null;
  
      $(imagesCollection).each(function(i) {
          if ($(activeImage).attr("src") === $(this).attr("src")) {
              index = i - 1;
          }
      });
  
      prev = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
  
      $(`#${lightboxId}`).find(".lightboxImage").attr("src", $(prev).attr("src"));
  }
  ,

 
  nextImage(lightboxId) {
    let activeImage = null;
    let currentSrc = $(`#${lightboxId}`).find(".lightboxImage").attr("src");

    $(".gallery-item").each(function() {
        if ($(this).prop("tagName") === "IMG" && $(this).attr("src") === currentSrc) {
            activeImage = $(this);
        } else if ($(this).prop("tagName") === "PICTURE" && $(this).find("img").attr("src") === currentSrc) {
            activeImage = $(this).find("img");
        }
    });

    let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
    let imagesCollection = [];

    if (activeTag === "all") {
        $(".item-column").each(function() {
            let image = $(this).children("img");
            if (image.length) {
                imagesCollection.push(image);
            } else {
                // Si l'image est à l'intérieur d'une balise <picture>
                let picture = $(this).children("picture");
                if (picture.length) {
                    imagesCollection.push(picture.find("img"));
                }
            }
        });
    } else {
        $(".item-column").each(function() {
            let image = $(this).children("img");
            if (image.length && image.data("gallery-tag") === activeTag) {
                imagesCollection.push(image);
            } else {
                // Si l'image est à l'intérieur d'une balise <picture>
                let picture = $(this).children("picture");
                if (picture.length && picture.find("img").data("gallery-tag") === activeTag) {
                    imagesCollection.push(picture.find("img"));
                }
            }
        });
    }

    let index = 0;
    let next = null;

    $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
            index = i + 1;
        }
    });

    next = imagesCollection[index] || imagesCollection[0];

    $(`#${lightboxId}`).find(".lightboxImage").attr("src", $(next).attr("src"));
},







    createLightBox(gallery, lightboxId, navigation) {
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },


    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },


    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      $(".active.active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag active");

      var tag = $(this).data("images-toggle");

      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }


  };
})(jQuery);
