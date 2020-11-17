    $().ready(function() {
      let hilo;
      $('#main_spa').load('init.html');
      /*--------------------------------------------------------------*/
      $('#inicio').click(function() {
        $('#main_spa').load('init.html', function() {
          setInterval(function() {
            $('#rotate_title').attr({
              style: 'transition: transform 1s; transform: rotateY(60deg);'
            });
          }, 1000);
        });
      });
      /*--------------------------------------------------------------*/
      $('#preferencias').click(function() {
        $('#main_spa').load('preferencias.html', function() {
          localStorage.setItem('cards_number', 20);
          localStorage.setItem('time', 0);
          $('.wrap-contact100').fadeIn(400);
          $('.dropdown').click(function() {
            $(this).attr('tabindex', 1).focus();
            $(this).toggleClass('active');
            $(this).find('.dropdown-menu').slideToggle(300);
          });
          $('.dropdown').focusout(function() {
            $(this).removeClass('active');
            $(this).find('.dropdown-menu').slideUp(300);
          });
          $('.dropdown .dropdown-menu li').click(function() {
            $(this).parents('.dropdown').find('span').text($(this).text());
            $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
          });
          $('.contact100-form-btn').click(function() {
            localStorage.setItem('cards_number', parseInt($('#num_cards')[0].value));
            localStorage.setItem('time', parseInt($('#time')[0].value));
          })
        });
      });
      /*--------------------------------------------------------------*/
      $('#jugar').click(function() {
        $('#main_spa').load('jugar.html', function() {
          clearInterval(hilo);
          if(isNaN(localStorage.getItem('cards_number'))) localStorage.setItem('cards_number', 20);
          if(isNaN(localStorage.getItem('time'))) localStorage.setItem('time', 0);
          let images_cards = [
            "img/naipes/bastos1.jpg",
            "img/naipes/bastos12.jpg",
            "img/naipes/copas1.jpg",
            "img/naipes/copas12.jpg",
            "img/naipes/espadas1.jpg",
            "img/naipes/espadas12.jpg",
            "img/naipes/oros1.jpg",
            "img/naipes/oros12.jpg",
            "img/naipes/reverso.jpg"
          ];
          let cards_face_up = 0;
          let cards_faceup_value;
          let card_element_faceup;
          let points = 0;
          let count = 0;
          let time;
          if (localStorage.getItem('time') == 0) {
            hilo = setInterval(function() {
              if (count == localStorage.getItem('cards_number')) {
                clearInterval(hilo);
                alert("Fin del juego!!");
                $('#total').text(extrapoints().toString());
              }
            }, 100);
            $('#tiempo').text('Tiempo ilimitado');
            time = -1;
          } else {
            time = localStorage.getItem('time');
          }
          if (time >= 0) {
            time = localStorage.getItem('time');
            hilo = setInterval(function() {
              $('#tiempo').text(time.toString());
              if (time == 0 || count == localStorage.getItem('cards_number')) {
                clearInterval(hilo);
                $('#img_card').prop("onclick", null).off("click");
                alert("Fin del juego!!");
                $('#total').text(extrapoints().toString());
              } else {
                time -= 1;
              }
            }, 1000);
          }
          function extrapoints() {
            if (localStorage.getItem('cards_number')==26) {
              points+=25;
            } else if (localStorage.getItem('cards_number')==32) {
              points+=50;
            }if (localStorage.getItem('time')==60) {
              points+=100;
            }if (localStorage.getItem('time')==90) {
              points+=75;
            }if (localStorage.getItem('time')==120) {
              points+=50;
            }if (localStorage.getItem('time')==150) {
              points+=25;
            }
            return points;
          }
          function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
          }
          function cardCreation(src_img) {
            let img_card = $(document.createElement('img')).attr({
              src: "img/naipes/reverso.jpg",
              id: "img_card"
            });
            img_card.click(function(e) {
              if (e.target.attributes[0].value == "img/naipes/reverso.jpg" && cards_face_up <= 1 && time != 0) {
                if (cards_face_up == 0) {
                  card_element_faceup = e.target;
                  e.target.src = src_img;
                  cards_faceup_value = src_img;
                  cards_face_up++;
                  count++;
                } else if (cards_face_up == 1) {
                  cards_face_up++;
                  if (src_img == cards_faceup_value) {
                    e.target.src = src_img;
                    cards_face_up = 0;
                    points += 15;
                    count++;
                    $('#puntos').text(points.toString());
                  } else {
                    e.target.src = src_img;
                    if(count!=0) count--;
                    setTimeout(function() {
                      e.target.src = "img/naipes/reverso.jpg";
                      card_element_faceup.src = "img/naipes/reverso.jpg";
                      cards_face_up = 0;
                    }, 700);
                    points -= 5;
                    $('#puntos').text(points.toString());
                  }
                }
              }
            });
            $('#board').append(img_card);
          }
          let withOutOrder = new Map();

          function random_cards() {
            for (let i = 0; i < localStorage.getItem('cards_number') / 2; i++) {
              let source_image = images_cards[Math.round(getRandomArbitrary(0, 7))];
              withOutOrder.set(Math.round(getRandomArbitrary(0, 1000)), source_image);
              withOutOrder.set(Math.round(getRandomArbitrary(0, 1000)), source_image);
            }
            if (withOutOrder.size != localStorage.getItem('cards_number')) {
              withOutOrder = new Map();
              random_cards();
            }
          }
          random_cards();
          let withOrder = new Map([...withOutOrder.entries()].sort());
          let iterator = withOrder.values();
          for (let i = 0; i < localStorage.getItem('cards_number'); i++) {
            cardCreation(iterator.next().value);
          }
        });
      });
      /*--------------------------------------------------------------*/
      $('#records').click(function() {
        $('#main_spa').load('resultados.html', function() {
          $.get("http://fenw.etsisi.upm.es:10000/records", function(informacion, estado) {
            for (let i = 0; i < 10; i++) {
              let img_card = $(document.createElement('tr'));
              let username = $(document.createElement('td')).text(informacion[i].username);
              let punctuation = $(document.createElement('td')).text(informacion[i].punctuation);
              let cards = $(document.createElement('td')).text(informacion[i].cards);
              let disposedTime = $(document.createElement('td')).text(informacion[i].disposedTime);
              let date = new Date(informacion[i].recordDate);
              let recordDate = $(document.createElement('td')).text(date.toLocaleString('en-US', { hour12: false }));
              img_card.append(username);
              img_card.append(punctuation);
              img_card.append(cards);
              img_card.append(disposedTime);
              img_card.append(recordDate);
              $('#t_body').append(img_card);
            }
          });
        });
      });
    });
