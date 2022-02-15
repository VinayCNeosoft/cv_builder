const fs = require('fs')
const PDFDocument=require('pdfkit')
module.exports=function createInvoice(pdf, path) {
	let doc = new PDFDocument({ margin: 10 });
	// generateHeader(doc,pdf);
	doc.moveTo(160, 20)                               // set the current point
   .lineTo(160, 770)                             // draw another line
   .stroke();
	generateUserInformation(doc, pdf);
	generateBioInformation(doc,pdf)
	generateSkillInfo(doc,pdf)
	generateLine(doc,100)
	generateEducationInfo(doc,pdf)
	generateLine(doc,230)
	generateExperienceInfo(doc,pdf)
	generateLine(doc,460)
	generateProjectInfo(doc,pdf)
    console.log(path)
	doc.end();
	doc.pipe(fs.createWriteStream(path));
}
// function generateHeader(doc,pdf) {
// 	// const shipping = invoice.shipping;

// 	doc.image(`${pdf.logo}`, 50, 45, { width: 50 })
// 	.moveDown();
// }

function generateUserInformation(doc, pdf) {
	
	doc.text(``, 30, 20)
		.text(`${pdf.profile.first_name} ${pdf.profile.last_name}`, {lineGap :10})
		doc.text(``, 30, 40)
		.text(`CONTACT :`,30,)
		.fontSize(10)
		.text(`${pdf.profile.email}`)
		.text(`Phone: ${pdf.profile.phone}`)
		.text(`Address: ${pdf.profile.address}`)
		.text(`${pdf.profile.city}`)
		.text(`${pdf.profile.state}`)
		.text(`${pdf.profile.pincode}`)
		.moveDown()
		marginTop = 150;
		doc.text(``, 30, 150)
		.text(`SKILLS :`,30,)
		.fontSize(10)
		for (i = 0; i < pdf.skill.length; i++) {
			const item = pdf.skill[i];
			const position =  marginTop +(i + 1) * 20;
			generateSkillInfo(
				doc,
				position,
				item.skillName,
				item.perfection,
			)
		}
		marginTop = 250;
		doc.text(``, 30, 250)
		.text(`SOCIAL PROFILE :`,30,)
		.fontSize(10)
		for (i = 0; i < pdf.socialProfile.length; i++) {
			const item = pdf.socialProfile[i];
			const position =  marginTop +(i + 1) * 20;
			generateSocialInfo(
				doc,
				position,
				item.platformLink,
			)
		}
		/* .text(`Invoice Date: ${invoice.invoiceDate}`, 200, 142, { align: 'right' })
		.text(`Due Date: ${invoice.dueDate}`, 200, 154, { align: 'right' })
		.text(`TOTAL AMOUNT:  ${invoice.invoiceAmount}`, 200, 200, { align: 'right' }) */
}
function generateSkillInfo(doc, y, c1, c2){
	doc.fontSize(10)
		.text(c1, 30, y)
		.text(c2, 100, y)
	doc.fontSize(10)
}
function generateSocialInfo(doc, y, c1){
	doc.fontSize(10)
		.text(c1, 30, y,{width: 140 })
	doc.fontSize(10)
}
function generateBioInformation(doc,pdf){
	doc.fontSize(
		10,
	)
	.text("BIO",170,20)
	.fontSize(10)
	.text(
		`${pdf.profile.bio}`,
		170,
		35,
		{ align: 'justify',indent:42, width: 400 }
	)
	.lineTo(100, 160)
	.moveDown();
}

function generateEducationInfo(doc,pdf){
	doc.fontSize(
		10,
	)
	.text("EDUCATION",170,120)
	.fontSize(10)
	.moveDown();
	generateLine(doc,140)
	marginTop = 160;
		for (i = 0; i < pdf.education.length; i++) {
			const item = pdf.education[i];
			const position =  marginTop +(i + 1) * 20;
			generateEduDataInfo(
				doc,
				position,
				item.degree_name,
				item.institute_name,
				item.percentage
			)
		}
}
function generateEduDataInfo(doc, y, c1, c2,c3){
	let data = 10
	doc.fontSize(10)
		.text(c1, 170, y)
		.text(c2, 300, y)
		.text(c3, 400, y)
	doc.fontSize(10)
}
function generateExperienceInfo(doc,pdf){
	doc.fontSize(
		10,
	)
	.text("EXPERIENCE",170,250)
	.fontSize(10)
	.moveDown();
	generateLine(doc,270)
	let i,
		experienceTop = 290;
        generateTableRow(
			doc,
			experienceTop,
			"Org. Name",
			"Joining Location",
			"Position",
			"CTC",
            "Joining Dt",
            "Leaving Dt",
            "Tech Used",
		);
		for (i = 0; i < pdf.experience.length; i++) {
		const item = pdf.experience[i];
		const position = experienceTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.organizationName,
			item.joiningLocation,
			item.position,
			item.ctc,
            item.joiningDate,
            item.leavingDate,
            item.technologiesWorkedOn,
		);
	}
}
function generateTableRow(doc, y, c1, c2, c3, c4, c5,c6,c7) {
	doc.fontSize(10)
		.text(c1, 170, y)
		.text(c2, 230, y)
		.text(c3, 300, y)
		.text(c4, 350, y)
		.text(c5, 390, y)
		.text(c6, 450, y)
		.text(c7, 520, y)
}

function generateProjectInfo(doc,pdf){
	doc.fontSize(
		10,
	)
	.text("PROJECT",170,480)
	.fontSize(10)
	.moveDown();
	generateLine(doc,500)
	let i,
		projectTop = 520;
        generateProjectRow(
			doc,
			projectTop,
			"Project Title",
			"Team Size",
			"Duration",
			"Tech Used",
            "Description",
		);
		for (i = 0; i < pdf.project.length; i++) {
		const item = pdf.project[i];
		const position = projectTop + (i + 1) * 30;
		generateProjectRow(
			doc,
			position,
			item.projectTitle,
			item.teamSize,
			item.duration,
			item.techUsed,
            item.descProj,
		);
	}
}
function generateProjectRow(doc, y, c1, c2, c3, c4, c5) {
	doc.fontSize(10)
		.text(c1, 170, y)
		.text(c2, 230, y)
		.text(c3, 320, y)
		.text(c4, 370, y)
		.text(c5, 420, y)
}
function generateLine(doc,h){
	doc.moveTo(170, h)                         // set the current point
   .lineTo(570, h)                            // draw a line
   .stroke();                                   // stroke the path
}
