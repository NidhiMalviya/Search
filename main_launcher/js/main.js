$(document).ready(function (params) {
  // Function for table load
  function load_articles() {

    var success_fun = function (data) {
      $("#content-space").html("");
      $('html, body').animate({
        'scrollTop' : $("#content-space").position().top
      });

      data.forEach(function (article, index) {
        $("#content-space").append(`
              <tr>
                <th scope="row">${index + 1}</th>
                <td>${article.title}</td>
                <td>${article.description}</td>
                <td>
                  <img src="data:image/jpg;base64,${article.article_image}" alt="Girl in a jacket" height="auto" width="50px">
                </td>
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

    make_request('GET', "http://localhost:3000", {}, success_fun)
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
        'scrollTop' : $("#editing_space").position().top
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
      data.forEach(function (article, index) {
        $("#content-space").append(`
              <tr>
                <th scope="row">${index + 1}</th>
                <span class="search-area">
                  <td>${article.title}</td>
                  <td>${article.description}</td>
                  <td>${article.image}</td>
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

      $("#content-space").find(".highlight").removeClass("highlight");
      var custfilter = new RegExp(search, "ig");
      var repstr = "<span class='highlight'>" + search + "</span>";

      if (search != "") {
          $('#content-space').each(function() {
              $(this).html($(this).html().replace(custfilter, repstr));
          })
      }

    }
    make_request('GET', url, {}, success_fun)
  });


  // For submitting the common form
  $("form").on("submit", function (event) {
    event.preventDefault();

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
      $("#notification-area")
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

  $('#preview-space').click(function(){
    $("#exampleFormControlImage").click();
  })

  $("#exampleFormControlImage").change(function(e) {
      readURL(this);
    }
  );

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $('#preview-space').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }

  load_articles();
  // First time page load
});
