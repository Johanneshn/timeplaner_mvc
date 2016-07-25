function summaryBox( processing )
{
	var canvasWidth = 80;
	var canvasHeight = 80;
	var leftMargin = 10;
	var barWidth = 60;
	
	processing.setup = function()
	{
		processing.noLoop();
		processing.size( canvasWidth, canvasHeight );
	};
	
	processing.update = function( presentations, groupworks,
								  discussions, breaks )
	{
		var total = 0;
		var scale = canvasHeight / 100;
		
		processing.background(255);
		processing.noStroke();
		
		processing.fill(27,122,224);
		processing.rect( leftMargin, total, barWidth, presentations * scale );
		total += presentations * scale;
		
		processing.fill(27,224,63);
		processing.rect(leftMargin,total, barWidth, groupworks * scale );
		total += groupworks * scale;
		
		processing.fill(232,107,107);
		processing.rect(leftMargin,total, barWidth, discussions * scale );
		total += discussions * scale;
		
		processing.fill(246,255,74);
		processing.rect(leftMargin,total, barWidth, breaks * scale );
		
		processing.stroke(255, 0, 0 );
		processing.line(0, canvasHeight * 7 / 10, canvasWidth, canvasHeight * 7 / 10 );
		
	};
}
