(function($){
  "use strict";
  /**
   * jQuery function to convert a nested nav list with any number of levels
   * to a select element with optgroup elements for the second-level subnav
   * (if any). Subnav levels beyond two are not considered as the function is
   * intended for use in circumstances (such as some mobile contexts) where
   * a full navigation menu in a select element is overkill.
   *
   * The function will set the 'selected' attribute on the appropriate option
   * element, PROVIDED that the links in the menu (a) do not use relative links,
   * and (b) do not include the hostname (e.g. /foo/bar, not ../bar, and not
   * http://www.example.com/foo/bar).
   *
   * Stores URLs in option elements' value attributes, and jumps to those
   * URLs on change event.
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
   *    formId string
   *      String to be used as value for form element id attribute.
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
   *    selectId string
   *      String to be used as value for select element id attribute.
   *    selectLabel string
   *      String to pass jquery to create label element. Automatically given
   *      'for' attribute corresponding to select element's 'id' attribute
   *
   *  @version 2.0
   *  @todo
   *    -- consider how to make the 'selected' attribute on option elements
   *       more reliable when links are absolute, including the hostname.
   */
  $.fn.menuToSelect = function($element, overrides) {
    var defaults = {
          baseUrl: '',
          form: '<form><div></div></form>',
          formId: 'menu-to-select--form',
          hideOriginal: true,
          optgroup: '<optgroup/>',
          optgroupLabelPattern: '',
          option: '<option/>',
          select: '<select/>',
          selectId: 'menu-to-select--select',
          selectLabel: ''
        },
        // Merge the defaults with the overrides:
        settings = $.extend({}, defaults, overrides),
        // Store the current top-level list element, and hide it if asked to
        // do so:
        $ul = $element.css({display: settings.hideOriginal ? 'none' : 'block'}),
        // Generate the form element complete with id and classes, and,
        // insert it in the document:
        $form = $(settings.form)
                  .attr({id: settings.formId})
                  .addClass('menuToSelect'),
        // Create the select, and attach the event listener to it:
        $select = $(settings.select)
                    .attr({id: settings.selectId})
                    .change(function(){
                      // On change, go to the location specified in this
                      // element's value attribute:
                      window.location.href = $(this).val();
                    }),
        // Build the label element, if any:
        $selectLabel = $(settings.selectLabel).attr({'for': settings.selectId}),
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
          // Store the contents of the href attribute:
          href = $link.attr('href'),
          // Retrieve any ul elements from it:
          $submenu = $current.children('ul'),
          // Store the link text for use in the option:
          $optionText = $link.text();
      // Create the option element with appropriate attributes, and
      // append it to the select, setting the selected attribute when required:
      $(settings.option)
        .attr({
          value: settings.baseUrl + href,
          selected: (window.location.pathname === href)
        })
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
              // Store the contents of the href attribute:
              href = $current.attr('href');
          // Create the option for the current element and append it
          // to the optgroup element, making sure to set the selected
          // attribute where needed:
          $(settings.option)
            .attr({
              value: settings.baseUrl + href,
              selected: (window.location.pathname === href)
            })
            .text($current.text())
            .appendTo($optgroup);
        });
      }
    });
    // Find the sole div in the form, and add the select and the label, if any,
    // to it:
    $form.find('div').append($selectLabel, $select);
    // Return the form:
    return $form;  
  }; /* $.fn.menuToSelect */
})(jQuery);