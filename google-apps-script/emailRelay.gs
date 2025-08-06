function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  GmailApp.sendEmail(data.to, data.subject, '', {
    htmlBody: data.htmlContent,
    name: data.fromName,
    replyTo: data.from,
    from: data.from
  });

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
}
