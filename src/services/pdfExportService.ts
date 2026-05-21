import { jsPDF } from 'jspdf';

// Since jsPDF autotable registers itself globally or needs to be imported:
// We dynamically require or import to prevent SSR/compilation issues.
import 'jspdf-autotable';

interface ExportData {
  metadata: {
    exportTimestamp: string;
    version: string;
    platform: string;
  };
  profile: any;
  journals: any[];
  expertReviews: any[];
  referralCode: any;
  referrals: any[];
  apiKeys: any[];
  verificationRequests: any[];
}

export function generateHealthReportPdf(data: ExportData) {
  const doc = new jsPDF() as any;

  const primaryColor = [11, 18, 33]; // #0B1221
  const accentColor = [59, 130, 246]; // #3B82F6
  const emeraldColor = [16, 185, 129]; // #10B981
  const textColor = [51, 65, 85]; // slate-700
  const lightBg = [248, 250, 252]; // slate-50

  // 1. Premium Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Accent Line
  doc.setFillColor(...accentColor);
  doc.rect(0, 40, 210, 2, 'F');

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('IKIKÉ HEALTH AI', 15, 20);
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('CLINICAL PORTFOLIO & PATIENT HEALTH VAULT', 15, 30);

  const timestamp = new Date(data.metadata.exportTimestamp).toLocaleString();
  doc.setFontSize(8);
  doc.text(`Generated: ${timestamp}`, 140, 28);
  doc.text(`System Version: ${data.metadata.version}`, 140, 33);

  // 2. Personal Profile Section
  doc.setTextColor(...primaryColor);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('1. Patient Identity Node', 15, 55);
  
  // Outer frame for Profile Card
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setFillColor(...lightBg);
  doc.roundedRect(15, 60, 180, 50, 3, 3, 'FD');

  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  
  const profile = data.profile || {};
  const name = profile.name || 'N/A';
  const email = profile.email || 'N/A';
  const username = profile.username || 'N/A';
  const role = profile.role || 'user';
  const tier = profile.tier || 'basic';
  const completed = profile.onboardingComplete ? 'Yes' : 'No';

  // Left Column
  doc.setFont('Helvetica', 'bold');
  doc.text('Full Name:', 25, 72);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(name), 50, 72);

  doc.setFont('Helvetica', 'bold');
  doc.text('Email Node:', 25, 82);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(email), 50, 82);

  doc.setFont('Helvetica', 'bold');
  doc.text('Username:', 25, 92);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(username), 50, 92);

  // Right Column
  doc.setFont('Helvetica', 'bold');
  doc.text('Role Class:', 115, 72);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(role).toUpperCase(), 140, 72);

  doc.setFont('Helvetica', 'bold');
  doc.text('Billing Tier:', 115, 82);
  doc.setFont('Helvetica', 'normal');
  doc.text(String(tier).toUpperCase(), 140, 82);

  doc.setFont('Helvetica', 'bold');
  doc.text('Onboarded:', 115, 92);
  doc.setFont('Helvetica', 'normal');
  doc.text(completed, 140, 92);

  let currentY = 125;

  // 3. Symptom Journal Section
  doc.setTextColor(...primaryColor);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('2. Symptom Journal Timeline', 15, currentY);
  currentY += 8;

  if (!data.journals || data.journals.length === 0) {
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('No active clinical logs recorded in this timeline.', 15, currentY);
    currentY += 15;
  } else {
    const journalRows = data.journals.map(j => {
      const date = j.timestamp?.seconds 
        ? new Date(j.timestamp.seconds * 1000).toLocaleDateString()
        : j.timestamp 
          ? new Date(j.timestamp).toLocaleDateString()
          : 'N/A';
      return [
        date,
        String(j.notes || j.primary || 'N/A'),
        String(j.severity || 'N/A').toUpperCase(),
        String(j.duration || 'N/A')
      ];
    });

    doc.autoTable({
      startY: currentY,
      head: [['Date', 'Symptom Note', 'Severity', 'Duration']],
      body: journalRows,
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: textColor
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 15, right: 15 },
      theme: 'grid'
    });

    currentY = doc.lastAutoTable.finalY + 15;
  }

  // 4. Referral Network Section
  doc.setTextColor(...primaryColor);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('3. Network Links & Referrals', 15, currentY);
  currentY += 8;

  const referralCodeStr = data.referralCode?.code || 'No active referral code generated.';
  doc.setTextColor(...textColor);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Active Referral Link Code: ${referralCodeStr}`, 15, currentY);
  currentY += 8;

  if (!data.referrals || data.referrals.length === 0) {
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('No mesh link invitation activities found.', 15, currentY);
    currentY += 15;
  } else {
    const referralRows = data.referrals.map(r => {
      const type = r.type === 'sent' ? 'Referral Sent' : 'Invitation Accepted';
      const emailVal = r.inviteeEmail || r.referrerEmail || 'N/A';
      const pts = r.pointsAwarded || 100;
      return [
        type,
        emailVal,
        `${pts} PTS`
      ];
    });

    doc.autoTable({
      startY: currentY,
      head: [['Type', 'Target Node Email', 'Awarded Intel Points']],
      body: referralRows,
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: textColor
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 15, right: 15 },
      theme: 'grid'
    });

    currentY = doc.lastAutoTable.finalY + 15;
  }

  // 5. Verification Stamp / Footer
  if (currentY > 250) {
    doc.addPage();
    currentY = 30;
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY, 195, currentY);
  currentY += 10;

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'italic');
  doc.text('This data porting package was securely compiled under patient authority guidelines.', 15, currentY);
  doc.text('IKIKÉ HEALTH PLATFORM SECURITY TEAM. HIPAA SECURE VAULT ACCESS CONSOLE.', 15, currentY + 5);

  doc.save(`health_records_export_${profile.uid || 'node'}.pdf`);
}
