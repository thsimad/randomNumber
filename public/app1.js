$(window).on('load', function(){
    console.log('Ready')
    $('#next').click(()=>{
        $('#form1').css("display", "none")
        $('#form2').css("display", "inline")    
    })
    $('#next1').click(()=>{
        $('#form1').css("display", "none")
        $('#form2').css("display", "none")
        $('#form3').css("display", "inline")
    })
    $('#back2').click(()=>{
        $('#form2').css("display", "none")
        $('#form1').css("display", "inline")
    })
    $('#back3').click(()=>{
        $('#form1').css("display", "none")
        $('#form3').css("display", "none")
        $('#form2').css("display", "inline")
    })
     // console.log('ready');
     $('#newsletters').on('submit',(event)=>{
        event.preventDefault();
        $.ajax({
            url:'/admin/newsletter',
            method: 'POST',
            contentType: 'application/json',
            beforeSend: function(){
                $('#queryFormAlert').html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            },
            complete: function(){
                $('#queryFormAlert').html('<div align="center" class="alert alert-success flash" role="alert">Submitted Your Query</div>');
            },
            data: JSON.stringify({
                email: $('#email').val(),
                subject: $('#subject').val(),
                message: $('#message').val()
            }),
            success: (response)=>{
                $('#queryFormAlert').html('<div align="center" class="alert alert-success flash" role="alert">'+response.message+'</div>');
                $("#queryFormSubmit")[0].reset();
            }
        })
    })
});