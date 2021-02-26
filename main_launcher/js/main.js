$(document).ready(function (params) {
  // Function for table load
  function load_articles(current_page = 1) {
    var success_fun = function (data) {
      if (data.last_page == true) {
        notify("Already on last page can't go any further");
        $("#prev_button").click();
      } else {
        $("#content-space").html("");
        $('html, body').animate({
          'scrollTop': $("#content-space").position().top
        });
        render_articles(data.articles);
       }
    }

    page_url = "http://localhost:3000?page_number=" + current_page;

    make_request('GET', page_url, {}, success_fun)
  }

  load_articles();

  function render_articles(articles) {
    articles.forEach(function (article, index) {
      $("#content-space").append(`
        <tr>
          <th scope="row">${index + 1}</th>
          <span class="search-area">
            <td>${article.title}</td>
            <td>${article.description}</td>
            <td><img src="data:image/jpg;base64,${article.article_image}" height="auto" width="50px"></td>
          </span>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn btn-primary btn-sm edit-article" data-id=${article.id}>Edit</button>
              <button type="button" class="btn btn-secondary btn-sm delete-article" data-id=${article.id}>Delete</button>
            </div>
          </td>
        </tr>
      `);
    });
  }

  // Edit User pre-processing
  $(document).on("click", ".edit-article", function (e) {
    e.preventDefault();
    article_id = this.dataset.id;
    url = `http://localhost:3000/articles/${article_id}`

    success_fun = function (data) {
      url = `http://localhost:3000/articles/${data.id}`
      $("#editing_space").append(`<input type="hidden" id="#hidden_id_field" name="article[id]" value="${data.id}">`);
      $("#exampleFormControlInput1").val(data.title);
      $("#exampleFormControlTextarea1").val(data.description);
      $("#preview-space").attr("src", ("data:image/jpg;base64," + data.article_image));

      $('html, body').animate({
        'scrollTop': $("#editing_space").position().top
      });

      $(".common_form").attr("method_type", "PUT");
      $(".common_form").attr("url", url);
      $("#form-header").html("Edit Article");
    }

    make_request('GET', url, {}, success_fun)
  });

  // Function for deleting articles
  $(document).on("click", ".delete-article", function (e) {
    e.preventDefault();
    article_id = this.dataset.id;
    url = `http://localhost:3000/articles/${article_id}`;

    success_fun = function () {
      console.log("data DELETED");
      load_articles();
    }

    make_request('DELETE', url, {}, success_fun);
  });


  $(".search-input").keyup(function (e) {
    e.preventDefault();
    article_id = this.dataset.id;
    search = $(".search-input").val()
    url = `http://localhost:3000/articles/search?search=${search}`;

    var success_fun = function (data) {
      $("#content-space").html("");
      render_articles(data);
      $("#content-space").find(".highlight").removeClass("highlight");
      var custfilter = new RegExp(search, "ig");
      var repstr = "<span class='highlight'>" + search + "</span>";

      if (search != "") {
        $('#content-space').each(function () {
          $(this).html($(this).html().replace(custfilter, repstr));
        })
      }
    }
    make_request('GET', url, {}, success_fun);
  });


  // For submitting the common form
  $("form").on("submit", function (event) {
    event.preventDefault();
    // validateForm();
    var formValues = new FormData(this);
    var method_type = $(".common_form").attr("method_type");
    var url = $(".common_form").attr("url");
    $("#editing_space").empty();

    if (!(url && method_type)) {
      method_type = 'POST';
      url = "http://localhost:3000/articles";
    }

    if (!(url && method_type)) {
      method_type = 'GET';
      url = "http://localhost:3000/articles";
    }

    $("#form-header").html("Add Article");
    $(this).trigger("reset");
    $("#preview-space").attr("src", "../user.png");

    success_fun = function (data) {
      load_articles();
      console.log(data);
      notify('Article saved successfuly');
    }

    make_request(method_type, url, formValues, success_fun);
  });

  // Commmon function for making ajax request
  function make_request(method_type, url, data, success_fun) {
    $.ajax({
      type: method_type,
      url: url,
      data: data,
      dataType: "JSON",
      processData: false,
      contentType: false,
      success: success_fun
    });
  }

  function notify(message) {
    $('#notification-area').showToast({
      message: message,
      duration: 3000,
      mode: 'success'
    });
  }

  $('#preview-space').click(function () {
    $("#exampleFormControlImage").click();
  })

  $("#exampleFormControlImage").change(function (e) {
    readURL(this);
  }
  );

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#preview-space').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }

  $("#prev_button").click(function (e) {
    e.preventDefault();
    $('html, body').animate({
      'scrollTop': $("#content-space").position().top
    });
    current_page = $("#current-page").val();

    if (current_page <= $(this).data("page")) {
      notify("already on First page");
    } else {
      $("#next_button").data('page', current_page);
      current_page = (current_page - 1);
      $("#current-page").val(current_page);

      if (current_page == 1) {
        $(this).data("page", current_page);
      } else {
        $(this).data("page", (current_page - 1));
      }
      load_articles(current_page);
    }
  });

  $("#next_button").click(function (e) {
    e.preventDefault();
    current_page = $(this).data("page");
    $("#current-page").val(current_page);
    $(this).data("page", (current_page + 1));
    $("#prev_button").data('page', (current_page - 1));
    load_articles(current_page);
  });

  $(document).on('click', "#add-article", function (e) {
    e.preventDefault();
    console.log("Nidhi rigged the thing");
    $('html, body').animate({
      'scrollTop': $("#form-header").offset().top
    });
  });

});
