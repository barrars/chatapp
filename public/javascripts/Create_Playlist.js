var My_Playlist = (function () {
  const open_create_playlist_modal_btn = document.getElementById('open_playlist_modal')
  let playlist_name_input = $('#create_playlist_name_input')
  let create_playlist_now_btn = $('#create_playlist_now_btn')

  /* Create playlsit button */
  open_create_playlist_modal_btn.addEventListener('click', (event) => {
    // console.log('event')
    /* OPen modal from Bootstraps */
    $('#create_playlist_modal').modal('toggle')
  })

  create_playlist_now_btn.on('click', create_playlist_on_server)

  create_playlist_name_input.onkeypress = function (e) {
    if (e.which === 13) {
      if (create_playlist_name_input.value.length > 0) {
        create_playlist_now_btn.click()
      }

      console.log(this)
    }
  }
  async function create_playlist_on_server () {
    /* get the name from input, and send POST to server */
    let playlist_name = $(playlist_name_input).val()
    if (!playlist_name) return
    let server_create_playlist = await $.post('/playlist/create', {
      playlist_name
    })
    logger.log('server_create_playlist'.green)
    logger.log(server_create_playlist)
  }

  /* Auto focus modal */
  $('#create_playlist_modal').on('shown.bs.modal', function () {
    // $('input:text:visible:first', this).focus()

    $('#create_playlist_name_input').focus()
  })
  // let create_playlist_modal = /* html */`

  // <div class="modal" tabindex="-1" role="dialog">
  //   <div class="modal-dialog" role="document">
  //     <div class="modal-content">
  //       <div class="modal-header">
  //         <h5 class="modal-title">Modal title</h5>
  //         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  //           <span aria-hidden="true">&times;</span>
  //         </button>
  //       </div>
  //       <div class="modal-body">
  //         <p>Modal body text goes here.</p>
  //       </div>
  //       <div class="modal-footer">
  //         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  //         <button type="button" class="btn btn-primary">Save changes</button>
  //       </div>
  //     </div>
  //   </div>
  // </div>`

  return {

  }
})()
