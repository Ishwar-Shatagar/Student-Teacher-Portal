import { PlacementRecord } from '../types';

// This data is a simulated scrape from:
// 1. https://www.bldeacet.ac.in/placement.php
// 2. https://www.bldeacet.ac.in/placement-branch-wise.php
// Data has been normalized and merged into the required schema.

export const PLACEMENT_DATA: PlacementRecord[] = [
  // 2023-24 Data from placement.php
  { id: 1, company_name: "Twilio", year: 2024, branch: "All", role: "Software Engineer", highest_package: 20.00, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 2, company_name: "Informatica", year: 2024, branch: "All", role: "Software Engineer", highest_package: 14.88, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 3, company_name: "Netskope", year: 2024, branch: "All", role: "Software Engineer", highest_package: 13.00, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 4, company_name: "Nokia", year: 2024, branch: "All", role: "Software Engineer", highest_package: 9.00, average_package: null, placed_count: 2, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 5, company_name: "Applied Materials", year: 2024, branch: "All", role: "Engineer", highest_package: 8.75, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 6, company_name: "EVIVE", year: 2024, branch: "All", role: "Software Engineer", highest_package: 8.00, average_package: null, placed_count: 2, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 7, company_name: "Target", year: 2024, branch: "All", role: "Engineer", highest_package: 7.70, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 8, company_name: "DXC Technology", year: 2024, branch: "All", role: "Software Engineer", highest_package: 6.50, average_package: null, placed_count: 5, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 9, company_name: "SLK Software", year: 2024, branch: "All", role: "Software Engineer", highest_package: 6.10, average_package: null, placed_count: 3, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 10, company_name: "UST Global", year: 2024, branch: "All", role: "Software Engineer", highest_package: 6.00, average_package: null, placed_count: 3, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 11, company_name: "Hexaware", year: 2024, branch: "All", role: "GET", highest_package: 6.00, average_package: null, placed_count: 12, placement_type: "On-Campus", location: "Chennai", notes: null, source_page: "placement.php" },
  { id: 12, company_name: "Accenture", year: 2024, branch: "All", role: "Associate Software Engineer", highest_package: 4.60, average_package: null, placed_count: 67, placement_type: "Pool-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 13, company_name: "Cognizant", year: 2024, branch: "All", role: "Graduate Engineer Trainee", highest_package: 4.00, average_package: null, placed_count: 8, placement_type: "Pool-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 14, company_name: "Wipro", year: 2024, branch: "All", role: "Project Engineer", highest_package: 3.50, average_package: null, placed_count: 2, placement_type: "Pool-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },

  // 2022-23 Data from placement.php
  { id: 15, company_name: "Twilio", year: 2023, branch: "All", role: "Software Engineer", highest_package: 36.00, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 16, company_name: "VMware", year: 2023, branch: "All", role: "MTS", highest_package: 26.00, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 17, company_name: "Cisco", year: 2023, branch: "All", role: "Software Engineer", highest_package: 22.00, average_package: null, placed_count: 1, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 18, company_name: "Nokia", year: 2023, branch: "All", role: "Software Engineer", highest_package: 9.00, average_package: null, placed_count: 10, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 19, company_name: "Target", year: 2023, branch: "All", role: "Engineer", highest_package: 7.70, average_package: null, placed_count: 5, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 20, company_name: "TCS", year: 2023, branch: "All", role: "Ninja", highest_package: 7.00, average_package: null, placed_count: 5, placement_type: "Pool-Campus", location: "Bangalore", notes: "Digital Offer", source_page: "placement.php" },
  { id: 21, company_name: "Accenture", year: 2023, branch: "All", role: "Associate Software Engineer", highest_package: 4.50, average_package: null, placed_count: 112, placement_type: "Pool-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 22, company_name: "Wipro", year: 2023, branch: "All", role: "Project Engineer", highest_package: 3.50, average_package: null, placed_count: 67, placement_type: "Pool-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  
  // 2021-22 Data from placement.php
  { id: 23, company_name: "Cisco", year: 2022, branch: "All", role: "Software Engineer", highest_package: 17.00, average_package: null, placed_count: 2, placement_type: "On-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },
  { id: 24, company_name: "L&T Infotech", year: 2022, branch: "All", role: "Software Engineer", highest_package: 6.50, average_package: null, placed_count: 15, placement_type: "Pool-Campus", location: "Mumbai", notes: null, source_page: "placement.php" },
  { id: 25, company_name: "Capgemini", year: 2022, branch: "All", role: "Software Consultant", highest_package: 4.00, average_package: null, placed_count: 104, placement_type: "Pool-Campus", location: "Bangalore", notes: null, source_page: "placement.php" },

  // Data from placement-branch-wise.php (2023-24)
  { id: 26, company_name: "Accenture", year: 2024, branch: "CSE", role: null, highest_package: 4.6, average_package: 4.6, placed_count: 26, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 27, company_name: "Accenture", year: 2024, branch: "ISE", role: null, highest_package: 4.6, average_package: 4.6, placed_count: 11, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 28, company_name: "Accenture", year: 2024, branch: "AIML", role: null, highest_package: 4.6, average_package: 4.6, placed_count: 15, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 29, company_name: "Accenture", year: 2024, branch: "ECE", role: null, highest_package: 4.6, average_package: 4.6, placed_count: 13, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 30, company_name: "Accenture", year: 2024, branch: "EEE", role: null, highest_package: 4.6, average_package: 4.6, placed_count: 2, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 31, company_name: "Hexaware", year: 2024, branch: "CSE", role: "GET", highest_package: 6.0, average_package: 6.0, placed_count: 4, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 32, company_name: "Hexaware", year: 2024, branch: "ISE", role: "GET", highest_package: 6.0, average_package: 6.0, placed_count: 3, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 33, company_name: "Hexaware", year: 2024, branch: "AIML", role: "GET", highest_package: 6.0, average_package: 6.0, placed_count: 4, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 34, company_name: "Hexaware", year: 2024, branch: "ECE", role: "GET", highest_package: 6.0, average_package: 6.0, placed_count: 1, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 35, company_name: "Cognizant", year: 2024, branch: "CSE", role: "GET", highest_package: 4.0, average_package: 4.0, placed_count: 4, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 36, company_name: "Cognizant", year: 2024, branch: "ISE", role: "GET", highest_package: 4.0, average_package: 4.0, placed_count: 2, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 37, company_name: "Cognizant", year: 2024, branch: "AIML", role: "GET", highest_package: 4.0, average_package: 4.0, placed_count: 2, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 38, company_name: "Nokia", year: 2024, branch: "CSE", role: "Software Engineer", highest_package: 9.0, average_package: 9.0, placed_count: 2, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 39, company_name: "UST Global", year: 2024, branch: "CSE", role: "Software Engineer", highest_package: 6.0, average_package: 6.0, placed_count: 2, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 40, company_name: "UST Global", year: 2024, branch: "ISE", role: "Software Engineer", highest_package: 6.0, average_package: 6.0, placed_count: 1, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 41, company_name: "Wipro", year: 2024, branch: "CSE", role: "Project Engineer", highest_package: 3.5, average_package: 3.5, placed_count: 1, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 42, company_name: "Wipro", year: 2024, branch: "ECE", role: "Project Engineer", highest_package: 3.5, average_package: 3.5, placed_count: 1, placement_type: "Pool-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },
  { id: 43, company_name: "Netskope", year: 2024, branch: "ISE", role: "Software Engineer", highest_package: 13.0, average_package: 13.0, placed_count: 1, placement_type: "On-Campus", location: null, notes: null, source_page: "placement-branch-wise.php" },

];
