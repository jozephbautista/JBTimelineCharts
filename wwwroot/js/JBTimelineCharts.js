// =====================================================
// Author: Jozeph Bautista
// LinkedIn: https://www.linkedin.com/in/jozephbautista/
// GitHub: https://github.com/jozephbautista
// =====================================================

function renderTimelineChart(properties, data) {
    if (properties.canvasType == "Standard") {
        buildChartStandard(properties, data);
    }
    else if (properties.canvasType == "ProductLifecycle") {
        buildChartProductLifecycle(properties, data);
    }
    else if (properties.canvasType == "NewsReview") {
        buildChartNewsReview(properties, data);
    }
}

function buildChartStandard(properties, timelineData) {

    // Init canvas
    var canvas = document.getElementById(properties.canvasId);
    var p = properties;

    canvas.width = p.canvasWidth;
    canvas.height = p.canvasHeight;
    var CTX = canvas.getContext('2d');
    CTX.clearRect(0, 0, p.canvasWidth, p.canvasHeight); // Clears canvas, useful for animation
    CTX.fillStyle = p.canvasBackgroundColor;
    CTX.fillRect(0, 0, p.canvasWidth, p.canvasHeight);

    // Render timeline bar
    CTX.fillStyle = p.timeLineBarBGColor;
    CTX.fillRect(p.timelineBarX, p.timelineBarY, p.timelineBarWidth, p.timeLineBarHeight); // x, y, width, height
    var monthX = p.timelineBarX;
    var monthY = p.timelineBarY + p.timeLineBarMonthOffsetY;
    for (var m = 0; m < monthsArray.length; m++) {
        CTX.font = p.timeLineBarMonthFont;
        CTX.fillStyle = p.timeLineBarMonthColor;
        var monthtextleftoffset = (p.timeLineBarMonthWidth - CTX.measureText(monthsArray[m]).width) / 2; // To center the text within 180px width
        CTX.fillText(monthsArray[m], monthX + monthtextleftoffset, monthY);
        monthX += p.timeLineBarMonthWidth;
    }

    // Render legend section
    //Border
    CTX.beginPath();
    CTX.moveTo(p.legendSectionX, p.legendSectionY);
    CTX.rect(p.legendSectionX, p.legendSectionY, p.legendSectionWidth, p.legendSectionHeight);
    CTX.strokeStyle = p.legendContainerBorderColor;
    CTX.stroke();
    //Header
    CTX.font = "Bold 12px Segoe UI";
    CTX.fillStyle = '#333333';
    var legendTitle = p.legendTitleText;
    var legendTitleOffset = ((p.legendSectionWidth - CTX.measureText(legendTitle).width) / 2);
    CTX.fillText(legendTitle, p.legendSectionX + legendTitleOffset, p.legendSectionY + 20);
    //Text
    CTX.font = "12px Segoe UI";
    CTX.fillText(eventtypes.KEYMOMENT, p.legendSectionX + 45, p.legendSectionY + 50);
    CTX.fillText(eventtypes.RELEASEMILESTONE, p.legendSectionX + 45, p.legendSectionY + 80);
    CTX.fillText(eventtypes.FIRSTPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 50);
    CTX.fillText(eventtypes.THIRDPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 80);
    //Icons
    CTX.beginPath();
    CTX.lineWidth = 1;
    drawStar(CTX, p, p.legendSectionX + 26, p.legendSectionY + 45, 5, 10, 5); // Star
    CTX.beginPath();
    CTX.strokeStyle = p.releaseMilestoneFontColor;
    CTX.rect(p.legendSectionX + 10, p.legendSectionY + 65, 30, 20); // Release Milestone (rectangle)
    //CTX.fillStyle = p.releaseMilestoneFontColor;
    //CTX.fillRect(p.legendSectionX + 15, p.legendSectionY + 65, 20, 20); // Release Milestone
    CTX.stroke();
    CTX.beginPath();
    CTX.fillStyle = p.firstPartyEventFontColor;
    CTX.fillRect(p.legendSectionX + 165, p.legendSectionY + 35, 20, 20); // 1st Party Event
    CTX.stroke();
    CTX.beginPath();
    CTX.fillStyle = p.thridPartyEventFontColor;
    CTX.fillRect(p.legendSectionX + 165, p.legendSectionY + 65, 20, 20); // 3rd Party Event
    CTX.stroke();

    // Count how many events per month
    function MonthCount(month, count) {
        this.Month = month;
        this.count = count;
    };
    var MonthCountArray = [];

    for (var m = 0; m < monthsArray.length; m++) {

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;
            }
        }

        MonthCountArray.push(new MonthCount(monthsArray[m], count));
    }

    // Iterate and render data for each month
    // Rule: Render only the first 4 events of a month
    for (var m = 0; m < MonthCountArray.length; m++) {

        // This will compress the data items towards the center of each month.
        // Set narrowMonthEdgePadding to zero so that there is no padding left and right, making the data items spread out evenly across 180 pixels.
        var narrowMonthEdgePadding = 50;
        var narrowMonthWidth = p.timeLineBarMonthWidth - (narrowMonthEdgePadding * 2);

        var MonthDataPointOffsetX = narrowMonthWidth / (MonthCountArray[m].count + 1);
        if (MonthCountArray[m].count >= p.maxDataPointPerMonth) {
            MonthDataPointOffsetX = narrowMonthWidth / (p.maxDataPointPerMonth + 1);
        }

        var lineLength = 0;
        var lineLengthStep = 100;

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;

                var lineBottomPadding = MonthCountArray[m].count < 5 ? 100 : 0;
                if (count <= p.maxDataPointPerMonth) {

                    lineLength = (lineBottomPadding + (MonthCountArray[m].count * lineLengthStep)) - (lineLengthStep * count);

                    // line
                    CTX.beginPath();
                    CTX.lineWidth = 2;
                    CTX.moveTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY);
                    CTX.lineTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY - lineLength);
                    CTX.strokeStyle = p.datapointLineColor;
                    CTX.stroke();

                    // circle
                    CTX.beginPath();
                    CTX.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY - lineLength) - 5, 5, 0, Math.PI * 2, false);
                    CTX.fillStyle = p.datapointCircleFillColor;
                    CTX.fill();
                    CTX.lineWidth = 2;
                    CTX.strokeStyle = p.datapointCircleBorderColor;
                    CTX.stroke();

                    // star
                    if (timelineData[e].eventtype == eventtypes.KEYMOMENT) {
                        drawStar(CTX, p, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 20, (p.timelineBarY - lineLength) - 45, 5, 10, 5); // Star
                    }

                    // date
                    CTX.font = p.datapointDateFont;
                    CTX.fillStyle = p.datapointDateColor;
                    CTX.fillText(timelineData[e].eventdaterange, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 20);

                    // title
                    CTX.font = p.datapointTitleFont;
                    if (timelineData[e].eventtype == eventtypes.FIRSTPARTYEVENT) {
                        CTX.fillStyle = p.firstPartyEventFontColor;
                    }
                    else if (timelineData[e].eventtype == eventtypes.THIRDPARTYEVENT) {
                        CTX.fillStyle = p.thridPartyEventFontColor;
                    }
                    else {
                        CTX.fillStyle = p.firstPartyEventFontColor; // for Key Moment and Release Milestone
                    }

                    var textobj = wrapText(CTX, timelineData[e].title, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

                    if (timelineData[e].eventtype == eventtypes.RELEASEMILESTONE) {
                        // Rectangle border
                        CTX.beginPath();
                        CTX.lineWidth = 1;
                        CTX.strokeStyle = p.releaseMilestoneFontColor;
                        var paddingright = 0;
                        if (textobj.linecounter == 1) {
                            paddingright = 30;
                        }
                        CTX.rect((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 7, (p.timelineBarY - lineLength) - 32, textobj.maxwidth + paddingright, textobj.yaxis - (p.timelineBarY - lineLength) + 37);
                        CTX.stroke();
                    }
                }

            }
        }
    }
}

function buildChartProductLifecycle(properties, timelineData) {
    // Init canvas
    var canvas = document.getElementById(properties.canvasId);
    var p = properties;

    canvas.width = p.canvasWidth;
    canvas.height = p.canvasHeight;
    var CTX = canvas.getContext('2d');
    CTX.clearRect(0, 0, p.canvasWidth, p.canvasHeight); // Clears canvas, useful for animation
    CTX.fillStyle = p.canvasBackgroundColor;
    CTX.fillRect(0, 0, p.canvasWidth, p.canvasHeight);

    // Render timeline bar
    CTX.fillStyle = p.timeLineBarBGColor;
    CTX.fillRect(p.timelineBarX, p.timelineBarY, p.timelineBarWidth, p.timeLineBarHeight); // x, y, width, height

    // Iterate and render data
    var DataPointOffsetX = p.timelineBarWidth / (timelineData.length + 1);

    var count = 0;
    var lineLength = 0;
    var lineOnTop = true;
    for (var m = 0; m < timelineData.length; m++) {
        count++;

        // Get how many lines when the title wraps. wrapText end parameter is false = no actual render
        var titleObj = wrapText(CTX, timelineData[m].title, 0, 0, p.datapointTextWrapLimit, p.datapointTitleLineHeight, false);
        var dateObj = wrapText(CTX, timelineData[m].eventdaterange, 0, 0, p.datapointTextWrapLimit, false);
        var innovationCount = 0;
        for (var i = 0; i < timelineData[m].innovations.length; i++) {
            var innovationObj = wrapText(CTX, "• " + timelineData[m].innovations[i], 0, 0, p.datapointTextWrapLimit, p.datapointTitleLineHeight, false);
            innovationCount = innovationCount + innovationObj.linecounter;
        }

        lineLength = 20 + (titleObj.linecounter * p.datapointTitleLineHeight) + (dateObj.linecounter * p.datapointTitleLineHeight) + (innovationCount * p.datapointTitleLineHeight);

        if (lineOnTop == true) {
            // line
            CTX.beginPath();
            CTX.lineWidth = 2;
            CTX.moveTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY);
            CTX.lineTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY - lineLength);
            CTX.strokeStyle = p.datapointLineColor;
            CTX.stroke();

            // circle
            CTX.beginPath();
            CTX.arc((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY - lineLength - 5, 5, 0, Math.PI * 2, false);
            CTX.fillStyle = p.datapointCircleFillColor;
            CTX.fill();
            CTX.lineWidth = 2;
            CTX.strokeStyle = p.datapointCircleBorderColor;
            CTX.stroke();

            // title
            CTX.font = p.datapointTitleFont;
            CTX.fillStyle = p.datapointTitleColor;
            var titleObj = wrapText(CTX, timelineData[m].title, (DataPointOffsetX * count) + 60, p.timelineBarY - lineLength - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // date
            CTX.font = p.datapointDateFont;
            CTX.fillStyle = p.datapointDateColor;
            var dateObj = wrapText(CTX, timelineData[m].eventdaterange, (DataPointOffsetX * count) + 60, titleObj.yaxis + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // innovations
            var lastLineYpos = dateObj.yaxis;
            for (var i = 0; i < timelineData[m].innovations.length; i++) {
                var innovationObj = wrapText(CTX, "• " + timelineData[m].innovations[i], (DataPointOffsetX * count) + 60, lastLineYpos + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);
                lastLineYpos = innovationObj.yaxis;
            }

            lineOnTop = false;
        }
        else {
            lineLength = 50;

            // line
            CTX.beginPath();
            CTX.lineWidth = 2;
            CTX.moveTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight);
            CTX.lineTo((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight + lineLength);
            CTX.strokeStyle = p.datapointLineColor;
            CTX.stroke();

            // circle
            CTX.beginPath();
            CTX.arc((p.timelineBarX) + (DataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight + lineLength + 5, 5, 0, Math.PI * 2, false);
            CTX.fillStyle = p.datapointCircleFillColor;
            CTX.fill();
            CTX.lineWidth = 2;
            CTX.strokeStyle = p.datapointCircleBorderColor;
            CTX.stroke();

            // title
            CTX.font = p.datapointTitleFont;
            CTX.fillStyle = p.datapointTitleColor;
            var titleObj = wrapText(CTX, timelineData[m].title, (DataPointOffsetX * count) + 60, p.timelineBarY + p.timeLineBarHeight + lineLength + 8, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // date
            CTX.font = p.datapointDateFont;
            CTX.fillStyle = p.datapointDateColor;
            var dateObj = wrapText(CTX, timelineData[m].eventdaterange, (DataPointOffsetX * count) + 60, titleObj.yaxis + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

            // innovations
            var lastLineYpos = dateObj.yaxis;
            for (var i = 0; i < timelineData[m].innovations.length; i++) {
                var innovationObj = wrapText(CTX, "• " + timelineData[m].innovations[i], (DataPointOffsetX * count) + 60, lastLineYpos + p.datapointTitleLineHeight, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);
                lastLineYpos = innovationObj.yaxis;
            }

            lineOnTop = true;
        }
    }

}

function buildChartNewsReview(properties, timelineData) {

    // Init canvas
    var canvas = document.getElementById(properties.canvasId);
    var p = properties;

    canvas.width = p.canvasWidth;
    canvas.height = p.canvasHeight;
    var CTX = canvas.getContext('2d');
    CTX.clearRect(0, 0, p.canvasWidth, p.canvasHeight); // Clears canvas, useful for animation
    CTX.fillStyle = p.canvasBackgroundColor;
    CTX.fillRect(0, 0, p.canvasWidth, p.canvasHeight);

    // Render timeline bar
    CTX.fillStyle = p.timeLineBarBGColor;
    CTX.fillRect(p.timelineBarX, p.timelineBarY, p.timelineBarWidth, p.timeLineBarHeight); // x, y, width, height
    var monthX = p.timelineBarX;
    var monthY = p.timelineBarY + p.timeLineBarMonthOffsetY;
    for (var m = 0; m < monthsArray.length; m++) {
        CTX.font = p.timeLineBarMonthFont;
        CTX.fillStyle = p.timeLineBarMonthColor;
        var monthtextleftoffset = (p.timeLineBarMonthWidth - CTX.measureText(monthsArray[m]).width) / 2; // To center the text within 180px width
        CTX.fillText(monthsArray[m], monthX + monthtextleftoffset, monthY);
        monthX += p.timeLineBarMonthWidth;
    }

    // Render legend section
    //Border
    CTX.beginPath();
    CTX.moveTo(p.legendSectionX, p.legendSectionY);
    CTX.rect(p.legendSectionX, p.legendSectionY, p.legendSectionWidth, p.legendSectionHeight);
    CTX.strokeStyle = p.legendContainerBorderColor;
    CTX.stroke();
    //Header
    CTX.font = "Bold 12px Segoe UI";
    CTX.fillStyle = '#333333';
    var legendTitle = p.legendTitleText;
    var legendTitleOffset = ((p.legendSectionWidth - CTX.measureText(legendTitle).width) / 2);
    CTX.fillText(legendTitle, p.legendSectionX + legendTitleOffset, p.legendSectionY + 20);
    //Text
    CTX.font = "12px Segoe UI";
    CTX.fillText(eventtypes_NewsReview.KEYMOMENT, p.legendSectionX + 45, p.legendSectionY + 50);
    CTX.fillText(eventtypes_NewsReview.PRBEAT, p.legendSectionX + 45, p.legendSectionY + 80);
    CTX.fillText(eventtypes_NewsReview.FIRSTPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 50);
    CTX.fillText(eventtypes_NewsReview.THIRDPARTYEVENT, p.legendSectionX + 190, p.legendSectionY + 80);
    //Icons
    CTX.beginPath();
    CTX.lineWidth = 1;
    drawStar(CTX, p, p.legendSectionX + 26, p.legendSectionY + 45, 5, 10, 5); // Star
    CTX.beginPath();
    CTX.strokeStyle = p.prBeatFontColor;
    CTX.rect(p.legendSectionX + 10, p.legendSectionY + 65, 30, 20); // Release Milestone (rectangle)
    //CTX.fillStyle = p.prBeatFontColor;
    //CTX.fillRect(p.legendSectionX + 15, p.legendSectionY + 65, 20, 20); // Release Milestone
    CTX.stroke();
    CTX.beginPath();
    CTX.fillStyle = p.firstPartyEventFontColor;
    CTX.fillRect(p.legendSectionX + 165, p.legendSectionY + 35, 20, 20); // 1st Party Event
    CTX.stroke();
    CTX.beginPath();
    CTX.fillStyle = p.thridPartyEventFontColor;
    CTX.fillRect(p.legendSectionX + 165, p.legendSectionY + 65, 20, 20); // 3rd Party Event
    CTX.stroke();

    // Count how many events per month
    function MonthCount(month, count) {
        this.Month = month;
        this.count = count;
    };
    var MonthCountArray = [];

    for (var m = 0; m < monthsArray.length; m++) {

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;
            }
        }

        MonthCountArray.push(new MonthCount(monthsArray[m], count));
    }

    // Iterate and render data for each month
    // Rule: Render only the first 4 events of a month
    for (var m = 0; m < MonthCountArray.length; m++) {

        // This will compress the data items towards the center of each month.
        // Set narrowMonthEdgePadding to zero so that there is no padding left and right, making the data items spread out evenly across 180 pixels.
        var narrowMonthEdgePadding = 50;
        var narrowMonthWidth = p.timeLineBarMonthWidth - (narrowMonthEdgePadding * 2);

        var MonthDataPointOffsetX = narrowMonthWidth / (MonthCountArray[m].count + 1);
        if (MonthCountArray[m].count >= p.maxDataPointPerMonth) {
            MonthDataPointOffsetX = narrowMonthWidth / (p.maxDataPointPerMonth + 1);
        }

        var lineOnTop = true;
        var lineLength = 0;
        var lineLengthStep = 45;

        var count = 0;
        for (var e = 0; e < timelineData.length; e++) {
            if (monthsArray[m] == timelineData[e].month) {
                count++;

                var monthMaxCount = MonthCountArray[m].count < 9 ? MonthCountArray[m].count : p.maxDataPointPerMonth;
                var linePadding = 40;

                if (lineOnTop == true) {
                    if (count <= p.maxDataPointPerMonth) {

                        if (monthMaxCount < 3) {
                            lineLength = linePadding;
                        } else {
                            lineLength = ((lineLengthStep * monthMaxCount)) - (lineLengthStep * count);
                        }

                        // line
                        CTX.beginPath();
                        CTX.lineWidth = 2;
                        CTX.moveTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY);
                        CTX.lineTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY - lineLength);
                        CTX.strokeStyle = p.datapointLineColor;
                        CTX.stroke();

                        // circle
                        CTX.beginPath();
                        CTX.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY - lineLength) - 5, 5, 0, Math.PI * 2, false);
                        CTX.fillStyle = p.datapointCircleFillColor;
                        CTX.fill();
                        CTX.lineWidth = 2;
                        CTX.strokeStyle = p.datapointCircleBorderColor;
                        CTX.stroke();

                        // star
                        if ((timelineData[e].badgetype == badgetypes_NewsReview.KEYMOMENT) || (timelineData[e].badgetype == badgetypes_NewsReview.ALL)) {
                            drawStar(CTX, p, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 20, (p.timelineBarY - lineLength) - 45, 5, 10, 5);
                        }

                        // date
                        CTX.font = p.datapointDateFont;
                        CTX.fillStyle = p.datapointDateColor;
                        CTX.fillText(timelineData[e].eventdaterange, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 20);

                        // title
                        CTX.font = p.datapointTitleFont;
                        if (timelineData[e].eventtype == eventtypes_NewsReview.FIRSTPARTYEVENT) {
                            CTX.fillStyle = p.firstPartyEventFontColor;
                        }
                        else if (timelineData[e].eventtype == eventtypes_NewsReview.THIRDPARTYEVENT) {
                            CTX.fillStyle = p.thridPartyEventFontColor;
                        }

                        var textobj = wrapText(CTX, timelineData[e].title, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, (p.timelineBarY - lineLength) - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

                        if (timelineData[e].badgetype == badgetypes_NewsReview.PRBEAT || timelineData[e].badgetype == badgetypes_NewsReview.ALL) {
                            // Rectangle border
                            CTX.beginPath();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.prBeatFontColor;
                            var paddingright = 0;
                            if (textobj.linecounter == 1) {
                                paddingright = 30;
                            }
                            CTX.rect((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 7, (p.timelineBarY - lineLength) - 32, textobj.maxwidth + paddingright, textobj.yaxis - (p.timelineBarY - lineLength) + 37);
                            CTX.stroke();
                        }
                    }

                    lineOnTop = false;
                }
                else {
                    if (count <= p.maxDataPointPerMonth) {

                        if (monthMaxCount < 3) {
                            lineLength = linePadding * 2;
                        } else {
                            lineLength = (linePadding + (lineLengthStep * monthMaxCount)) - (lineLengthStep * (count - 1));
                        }

                        // line
                        CTX.beginPath();
                        CTX.lineWidth = 2;
                        CTX.moveTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), p.timelineBarY + p.timeLineBarHeight);
                        CTX.lineTo((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), (p.timelineBarY + p.timeLineBarHeight) + lineLength);
                        CTX.strokeStyle = p.datapointLineColor;
                        CTX.stroke();

                        // circle
                        CTX.beginPath();
                        CTX.arc((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count), ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 5, 5, 0, Math.PI * 2, false);
                        CTX.fillStyle = p.datapointCircleFillColor;
                        CTX.fill();
                        CTX.lineWidth = 2;
                        CTX.strokeStyle = p.datapointCircleBorderColor;
                        CTX.stroke();

                        // star
                        if (timelineData[e].eventtype == eventtypes_NewsReview.KEYMOMENT || timelineData[e].badgetype == badgetypes_NewsReview.ALL) {
                            drawStar(CTX, p, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 20, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 45, 5, 10, 5);
                        }

                        // date
                        CTX.font = p.datapointDateFont;
                        CTX.fillStyle = p.datapointDateColor;
                        CTX.fillText(timelineData[e].eventdaterange, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 20);

                        // title
                        CTX.font = p.datapointTitleFont;
                        if (timelineData[e].eventtype == eventtypes_NewsReview.FIRSTPARTYEVENT) {
                            CTX.fillStyle = p.firstPartyEventFontColor;
                        }
                        else if (timelineData[e].eventtype == eventtypes_NewsReview.THIRDPARTYEVENT) {
                            CTX.fillStyle = p.thridPartyEventFontColor;
                        }

                        var textobj = wrapText(CTX, timelineData[e].title, (p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 10, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 2, p.datapointTextWrapLimit, p.datapointTitleLineHeight, true);

                        if (timelineData[e].badgetype == eventtypes_NewsReview.PRBEAT || timelineData[e].badgetype == badgetypes_NewsReview.ALL) {
                            // Rectangle border
                            CTX.beginPath();
                            CTX.lineWidth = 1;
                            CTX.strokeStyle = p.prBeatFontColor;
                            var paddingright = 0;
                            if (textobj.linecounter == 1) {
                                paddingright = 30;
                            }
                            CTX.rect((p.timelineBarX + (p.timeLineBarMonthWidth * m)) + narrowMonthEdgePadding + (MonthDataPointOffsetX * count) + 7, ((p.timelineBarY + p.timeLineBarHeight) + lineLength) - 32, textobj.maxwidth + paddingright, textobj.yaxis - ((p.timelineBarY + p.timeLineBarHeight) + lineLength) + 37);
                            CTX.stroke();
                        }                    }

                    lineOnTop = true;
                }

            }
        }
    }
}




// ================
// Common functions
// ================
function wrapText(context, text, x, y, maxWidth, lineHeight, rendertext) {
    var words = text.split(' ');

    var isBulletItem = false;
    var indent = "";
    if (words[0] == "•") {
        isBulletItem = true;
    }

    var line = '';
    var linecounter = 0;
    var maxtextwidth = 0;

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        //console.log(words[n] + " ----- width: " + testWidth);

        if (testWidth > maxtextwidth) {
            maxtextwidth = testWidth;
        }

        if (testWidth > maxWidth && n > 0) {
            if (rendertext == true) {
                indent = "";
                if (isBulletItem && line.indexOf("•") == -1) {
                    indent = "   ";
                }

                // Not last line of wrapped text
                context.fillText(indent + line, x, y);
            }

            linecounter++;
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }

    if (rendertext == true) {
        indent = "";
        if (isBulletItem && line.indexOf("•") == -1) {
            indent = "   ";
        }

        // Last line of wrapped text
        context.fillText(indent + line, x, y);
    }

    linecounter++;

    var textobj = {
        linecounter: linecounter,
        maxwidth: Math.floor(maxtextwidth),
        yaxis: y
    };

    return textobj;
}

function drawStar(context, cprop, cx, cy, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    context.beginPath();
    context.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y)
        rot += step
    }
    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = cprop.starBorderColor;
    context.stroke();
    context.fillStyle = cprop.starFillColor;
    context.fill();
}