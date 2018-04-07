// Initialize Firebase
var config = {
    apiKey: "AIzaSyC_6izCtabkuYLL49_n51p4CnWaHmFjqa4",
    authDomain: "train-arrival-choo-choo.firebaseapp.com",
    databaseURL: "https://train-arrival-choo-choo.firebaseio.com",
    projectId: "train-arrival-choo-choo",
    storageBucket: "train-arrival-choo-choo.appspot.com",
    messagingSenderId: "94175632180"
};
firebase.initializeApp(config);

var database = firebase.database();
var currentTime = moment();

database.ref().on('child_added', function (childSnap) {
    var name = childSnap.val().name;
    var dstntn = childSnap.val().dstntn;
    var frstTrn = childSnap.val().frstTrn;
    var frqncy = childSnap.val().frqncy;
    var min = childSnap.val().min;
    var nxt = childSnap.val().nxt;

    $('#trainTable > tbody').append('<tr><td>' + name + '</td><td>' + dstntn + '</td><td>' + frqncy + '</td><td>' + nxt + '</td><td>' + min + '</td><td>');
});

database.ref().on('value', function (snapshot) {

});

//Grabs input from the form
$('#addTrnBtn').on('click', function () {
    var trnName = $("#nameAtrain").val().trim();
    var dstntn = $("#nameAdestination").val().trim();
    var frstTrn = $("#inpStart").val().trim();
    var frqncy = $("#inpFrqncy").val().trim();

    //Value validation
    if (trnName == '') {
        alert('A train name is required.');
        return false;
    }
    if (dstntn == '') {
        alert('Enter your destination.');
        return false;
    }
    if (frstTrn == '') {
        alert('Start time is required ?');
        return false;
    }
    if (frqncy == '') {
        alert('How frequent the train should arrive?');
        return false;
    }

    //The mother Math!
    var cnvrtFrstTrnTime = moment(frstTrn, "hh:mm").subtract("1, years") //This equation will take care of the current time. It will subtract start time back a year to ensure it is before current time.

    var betweenTrnTime = currentTime.diff(moment(cnvrtFrstTrnTime), 'minutes'); // First train start time is the initial time which will set the difference between current time and first train time.

    var rmndr = betweenTrnTime % frqncy; //calculates the remainder

    var waiTime = frqncy - rmndr; //Calculates wait time

    var nxTrn = moment().add(waiTime, "minutes").format("hh:mm a");

    console.log(" \nCnvrtd Time | " + cnvrtFrstTrnTime + " \nTime Between Trains | " + betweenTrnTime + " Remainder | " + rmndr + " Wait Time | " + waiTime + "\n Next train arrival time | " + nxTrn + " | ", )
    var nextTrain = {
        name: trnName,
        dstntn: dstntn,
        frstTrn: frstTrn,
        frqncy: frqncy,
        min: waiTime,
        nxt: nxTrn
    };
    console.log(nextTrain);

    //Current train schedule will be populated with users input
    database.ref().push(nextTrain);

    $('#nameAtrain').val('');
    $('#nameAdestination').val('');
    $('#inpStart').val('');
    $('#inpFrqncy').val('');

    return false;

}); //botom btn