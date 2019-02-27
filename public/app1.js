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
});