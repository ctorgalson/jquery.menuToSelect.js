(function($){
  "use strict";
  /**
   * jQuery plugin to convert a nested nav list to a select element with
   * optgroup elements for the second-level subnav (if any). Stores URLs
   * in option elements' value attributes, and jumps to those URLs on
   * change event.
   *
   * @param object overrides
   *    Provides configuration options for the resulting form:
   *
   *    baseUrl string
   *      Base of URL for value attributes in option elements (usually not
   *      required). Defaults to ''.
   *    form string
   *      String to pass to jquery to create form element. Should contain
   *      exactly one div element. Defaults to '<form><div></div></form>'.
   *    hideOriginal bool
   *      Whether or not to hide the list elements targetted by this plugin.
   *      Defaults to 'true'.
   *    optgroup string
   *      String to pass jquery to create optgroup elements when needed.
   *      Should seldom, if ever, need to be altered. Defaults to
   *      '<optgroup/>'.
   *    optgroupLabelPattern string
   *      Optional string for label attribute in optgroup elements. If this
   *      value contains '%p', it will be substituted with the text of the
   *      most recently traversed link in the original menu. Defaults to ''.
   *    option string
   *      String to pass jquery to create option elements as needed. Will
   *      seldom, if ever, need alteration. Defaults to '<option/>'.
   *    select string
   *      String to pass jquery to create the option element. Will seldom,
   *      if ever, need alteration, but may be useful for adding classes
   *      or other attributes. Defaults to '<option/>'.
   *
   *  @version 1.0
   */
  $.fn.menuToSelect = function(overrides) {
    var defaults = {
          baseUrl: '',
          form: '<form><div></div></form>',
          hideOriginal: true,
          optgroup: '<optgroup/>',
          optgroupLabelPattern: '',
          option: '<option/>',
          select: '<select/>'
        },
        // Merge the defaults with the overrides:
        settings = $.extend({}, defaults, overrides);
    // Loop through all the items in the jQuery collection:
    return this.each(function(i,e){
      // Store the current top-level list element, and hide it if asked to
      // do so:
      var $ul = $(this).css({display: settings.hideOriginal ? 'none' : 'block'}),
          // Store the id attribute of the ul:
          ulId = $ul.attr('id'),
          // Generate an id attribute for the select:
          formId = ((typeof ulId !== 'undefined' && ulId !== '') ? ulId + '-' : '') + 'menuToSelect-' + i,
          // Generate the form element complete with id and classes, and,
          // insert it in the document:
          $form = $(settings.form)
                    .attr({id: formId})
                    .addClass('menuToSelect')
                    .insertAfter($ul),
          // Create the select, and attach the event listener to it:
          $select = $(settings.select)
                      .change(function(){
                        // On change, go to the location specified in this
                        // element's value attribute:
                        window.location.href = $(this).val();
                      }),
          // Retrieve all the links in this ul on the top level only
          // (.children() can only find li elements in a ul if this is
          // valid html...)
          $links = $ul.children();
      // Loop through the links on the top level:
      $links.each(function(i,e){
        // Store the current list item:
        var $current = $(e),
            // Retrieve the link from it:
            $link = $(e).children('a'),
            // Retrieve any ul elements from it:
            $submenu = $current.children('ul'),
            // Store the link text for use in the option:
            $optionText = $link.text(),
            // Create the option element with appropriate attributes, and
            // append it to the select:
            $option = $(settings.option)
                        .attr({value: settings.baseUrl + $link.attr('href')})
                        .text($optionText)
                        .appendTo($select);
        // If there IS a submenu:
        if ($submenu.length > 0) {
          // Create an optgroup with a (possibly empty) label attribute
          // based on the pattern provided in settings, and append it to
          // the select:
          var $optgroup = $(settings.optgroup)
                            .attr({label: (settings.optgroupLabelPattern !== '' ? settings.optgroupLabelPattern.replace(/\%p/, $optionText) : '')})
                            .appendTo($select);
          // Then, loop through the top level links in the submenu only:
          $submenu.children('li').children('a').each(function(i,e){
            // Store the current link:
            var $current = $(e),
                // Create the option for the current element and append it
                // to the optgroup element:
                $option = $(settings.option)
                            .attr({value: settings.baseUrl + $current.attr('href')})
                            .text($current.text())
                            .appendTo($optgroup);
          });
        }
      });
      // Find the sole div in the form, and add the select to it:
      $form.find('div').append($select);
    });
  }; /* $.fn.menuToSelect */
})(jQuery);