const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
const bwipjs = require("bwip-js");
const fs = require("fs");
const textwrap = require("text-wrap");

async function generatePDF(
  templatePath,
  photoPath,
  rollno,
  dob,
  mobile,
  address,
  outputPath,
  name = ""
) {
  try {
    // Load the template image
    const templateImage = sharp(templatePath);

    // Get template dimensions
    const { width: templateWidth, height: templateHeight } =
      await templateImage.metadata();

    // Create SVG for text
    let svgText = `
      <svg width="${templateWidth}" height="${templateHeight}" xmlns="http://www.w3.org/2000/svg">
          <text x="330" y="555" font-size="30" fill="black">${rollno}</text>
          <text x="330" y="608" font-size="30" fill="black">${dob}</text>
          <text x="313" y="661" font-size="30" fill="black">${mobile}</text>
    `;

    // Wrap and add the address text
    const wrappedAddress = textwrap(address, { width: 30 });
    const addressLines = wrappedAddress.split("\n");
    let yAddress = 714;
    addressLines.forEach((line) => {
      svgText += `<text x="313" y="${yAddress}" font-size="30" fill="black">${line}</text>`;
      yAddress += 35;
    });

    // Wrap and add the name (if provided)
    if (name) {
      const wrappedName = textwrap(name, { width: 30 });
      const nameLines = wrappedName.split("\n");
      let yName = 500;
      nameLines.forEach((line) => {
        svgText += `<text x="313" y="${yName}" font-size="30" fill="black">${line}</text>`;
        yName += 35;
      });
    }

    svgText += `</svg>`;

    // Overlay SVG text onto the template
    const templateWithText = await sharp(await templateImage.toBuffer())
      .composite([{ input: Buffer.from(svgText), top: 0, left: 0 }])
      .toBuffer();

    // Add the photo
    const resizedPhoto = await sharp(photoPath)
      .resize(200, 200, { fit: "inside" }) // Ensure photo fits in the allocated space
      .toBuffer();
    const templateWithPhoto = await sharp(templateWithText)
      .composite([{ input: resizedPhoto, top: 240, left: 215 }])
      .toBuffer();

    // Generate barcode
    const barcode = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: "code128", // Barcode type
          text: rollno, // Text to encode
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: "center",
        },
        (err, png) => {
          if (err) return reject(err);
          resolve(png);
        }
      );
    });

    // Resize the barcode to fit and add it
    const resizedBarcode = await sharp(barcode)
      .resize(200, 70, { fit: "inside" })
      .toBuffer();
    const finalTemplate = await sharp(templateWithPhoto)
      .composite([{ input: resizedBarcode, top: 815, left: 220 }])
      .toBuffer();

    // Save as a temporary image file
    const tempImagePath = "output_image.jpg";
    fs.writeFileSync(tempImagePath, finalTemplate);

    // Convert the final image to a PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const jpgImage = await pdfDoc.embedJpg(fs.readFileSync(tempImagePath));
    page.drawImage(jpgImage, {
      x: 50,
      y: 100,
      width: 500,
      height: 700,
    });

    // Write the PDF to file
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    // Clean up temporary files
    fs.unlinkSync(tempImagePath);

    console.log(`PDF generated successfully: ${outputPath}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

// Example usage
generatePDF(
  "GSA ID CARD_blank-01.jpg",
  "photo.jpg",
  "12345",
  "2000-01-01",
  "+919876543210",
  "Gandhinagar, Gujarat, Sector 8, Near CH3, Long Address Example for Testing",
  "output_id_card.pdf",
  "Johnathan Doe Longname Example"
);
