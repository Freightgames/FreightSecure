// Scenario class for managing different fraud scenarios
class Scenario {
    constructor(playerRole) {
        this.playerRole = playerRole;
        this.scenarioType = null;
        this.gameInstance = null;
        this.fraudDetected = false;
        
        // Possible scenario types
        this.scenarioTypes = {
            PHISHING_EMAIL: 'phishing_email',
            FAKE_RATE_CONFIRMATION: 'fake_rate_confirmation',
            PARTNER_VERIFICATION: 'partner_verification'
        };
        
        // Carrier-specific scenarios
        this.carrierScenarios = [
            {
                type: this.scenarioTypes.PHISHING_EMAIL,
                title: 'Suspicious Email',
                content: this.generatePhishingEmail('carrier'),
                correctAction: 'report',
                feedbackCorrect: 'Good job! You correctly identified a phishing attempt. The domain "loadbord-secure.com" is a misspelling of a legitimate site, and the urgent request for account verification is a common phishing tactic.',
                feedbackIncorrect: 'This was a phishing email. The domain "loadbord-secure.com" is a misspelling of a legitimate site, and the urgent request for account verification is a common phishing tactic. Always verify sender addresses carefully.'
            },
            {
                type: this.scenarioTypes.FAKE_RATE_CONFIRMATION,
                title: 'Rate Confirmation Check',
                content: this.generateFakeRateConfirmation('carrier'),
                correctAction: 'reject',
                feedbackCorrect: 'Good catch! This rate confirmation had several red flags: the broker MC# was incorrect, the payment terms were unusually long, and the contact email domain didn\'t match the company name.',
                feedbackIncorrect: 'You missed some red flags in this rate confirmation. The broker MC# was incorrect, the payment terms were unusually long (90 days), and the contact email domain didn\'t match the company name.'
            },
            {
                type: this.scenarioTypes.PARTNER_VERIFICATION,
                title: 'Broker Verification',
                content: this.generateBrokerProfile(),
                correctAction: 'reject',
                feedbackCorrect: 'Excellent! You correctly identified a high-risk broker. Their Ansonia credit score of 42 indicates poor payment history, and their 60+ days to pay is well above the industry standard.',
                feedbackIncorrect: 'This broker had several red flags you should have noticed. Their Ansonia credit score of 42 indicates poor payment history, and their 60+ days to pay is well above the industry standard.'
            }
        ];
        
        // Broker-specific scenarios
        this.brokerScenarios = [
            {
                type: this.scenarioTypes.PHISHING_EMAIL,
                title: 'Suspicious Email',
                content: this.generatePhishingEmail('broker'),
                correctAction: 'report',
                feedbackCorrect: 'Well done! You correctly identified a phishing attempt. The email contained a suspicious attachment, an urgent tone, and a mismatched sender address.',
                feedbackIncorrect: 'This was a phishing email. The email contained a suspicious attachment, an urgent tone, and the sender address (trucking-verify@carriercheck.co) doesn\'t match the purported company.'
            },
            {
                type: this.scenarioTypes.FAKE_RATE_CONFIRMATION,
                title: 'Rate Confirmation Check',
                content: this.generateFakeRateConfirmation('broker'),
                correctAction: 'reject',
                feedbackCorrect: 'Great job! You identified a tampered rate confirmation. The rate was altered from $2,500 to $3,500, and the delivery date was changed.',
                feedbackIncorrect: 'You missed signs of tampering in this rate confirmation. The rate was altered from $2,500 to $3,500, and the delivery date was changed from the original document.'
            },
            {
                type: this.scenarioTypes.PARTNER_VERIFICATION,
                title: 'Carrier Verification',
                content: this.generateCarrierProfile(),
                correctAction: 'reject',
                feedbackCorrect: 'Good decision! This carrier has serious safety issues with an Unsafe Driving BASIC score of 87% (above the 65% threshold) and a Crash Indicator of 72%.',
                feedbackIncorrect: 'This carrier had serious safety issues you should have noticed. Their Unsafe Driving BASIC score of 87% is above the 65% threshold and their Crash Indicator of 72% also exceeds FMCSA thresholds.'
            }
        ];
    }
    
    initialize(gameInstance) {
        this.gameInstance = gameInstance;
        
        // Select a random scenario based on player role
        if (this.playerRole === 'carrier') {
            this.currentScenario = this.getRandomScenario(this.carrierScenarios);
        } else {
            this.currentScenario = this.getRandomScenario(this.brokerScenarios);
        }
        
        this.scenarioType = this.currentScenario.type;
        console.log(`Initialized scenario: ${this.scenarioType}`);
    }
    
    getRandomScenario(scenarioList) {
        const randomIndex = Math.floor(Math.random() * scenarioList.length);
        return scenarioList[randomIndex];
    }
    
    generatePhishingEmail(role) {
        if (role === 'carrier') {
            return {
                from: 'security@loadbord-secure.com',
                subject: 'URGENT: Verify Your Account to Maintain Access',
                date: 'Today, 10:23 AM',
                body: `
                    <p>Dear Valued Carrier,</p>
                    <p>Our security team has detected unusual activity on your loadboard account. To protect your account and maintain access to available loads, you must verify your information immediately.</p>
                    <p><strong>If you do not verify within 24 hours, your account will be suspended and any assigned loads may be reassigned.</strong></p>
                    <p>Please click the button below to verify your account:</p>
                    <button class="btn">Verify Account</button>
                    <p>Thank you for your cooperation,</p>
                    <p>LoadBoard Security Team</p>
                `,
                attachments: []
            };
        } else {
            return {
                from: 'trucking-verify@carriercheck.co',
                subject: 'New Carrier Documentation for Immediate Review',
                date: 'Today, 11:45 AM',
                body: `
                    <p>Hello Broker Partner,</p>
                    <p>Please find attached the updated insurance and authority documentation for Fast Trucking LLC (MC# 987654).</p>
                    <p><strong>We need these approved immediately as we have a truck available in your area and can pick up within the hour.</strong></p>
                    <p>Please review and approve by clicking the link below:</p>
                    <button class="btn">Review Documents</button>
                    <p>Regards,</p>
                    <p>Michael Johnson<br>Fast Trucking LLC</p>
                `,
                attachments: ['Insurance_Doc_FastTrucking.exe']
            };
        }
    }
    
    generateFakeRateConfirmation(role) {
        if (role === 'carrier') {
            return {
                loadId: 'LB12345678',
                broker: {
                    name: 'Elite Logistics Solutions',
                    mc: '123456', // Incorrect MC number (should be 723456)
                    contact: 'Sarah Wilson',
                    email: 'swilson@eliteship.net', // Domain doesn't match company name
                    phone: '(555) 987-6543'
                },
                pickup: {
                    location: 'Chicago, IL',
                    date: '05/15/2023',
                    time: '08:00'
                },
                delivery: {
                    location: 'Atlanta, GA',
                    date: '05/17/2023',
                    time: '14:00'
                },
                rate: '$2,800.00',
                paymentTerms: '90 days', // Unusually long payment terms
                notes: 'Must call 1 hour before pickup and delivery'
            };
        } else {
            return {
                loadId: 'LB12345678',
                broker: {
                    name: 'Your Brokerage',
                    mc: '587412',
                    contact: 'You',
                    email: 'you@yourbrokerage.com',
                    phone: '(555) 123-4567'
                },
                carrier: {
                    name: 'Reliable Transport Inc',
                    mc: '654321',
                    dot: '1234567',
                    contact: 'John Smith',
                    phone: '(555) 765-4321'
                },
                pickup: {
                    location: 'Chicago, IL',
                    date: '05/15/2023',
                    time: '08:00'
                },
                delivery: {
                    location: 'Dallas, TX',
                    date: '05/16/2023', // Original date was 05/18/2023
                    time: '14:00'
                },
                rate: '$3,500.00', // Original rate was $2,500.00
                paymentTerms: '30 days',
                notes: 'Rate confirmation has been amended'
            };
        }
    }
    
    generateBrokerProfile() {
        return {
            name: 'Quick Freight Solutions',
            mc: '345678',
            yearsInBusiness: 1.5,
            address: '123 Commerce Dr, Atlanta, GA 30339',
            creditMetrics: {
                ansoniaScore: 42, // Below 60 is poor
                daysToPay: 64, // Over 45 days is concerning
                paymentHistory: 'Inconsistent'
            },
            contactInfo: {
                name: 'Robert Johnson',
                phone: '(555) 234-5678',
                email: 'rjohnson@quickfreight.biz'
            },
            references: {
                count: 2, // Low number of references
                averageRating: '2.5/5'
            }
        };
    }
    
    generateCarrierProfile() {
        return {
            name: 'Fast Express Trucking',
            mc: '789012',
            dot: '1234567',
            authority: 'Active since 2021',
            address: '456 Industrial Pkwy, Memphis, TN 38118',
            safetyMetrics: {
                unsafeDriving: '87%', // Above 65% threshold (bad)
                hoursOfService: '58%',
                driverFitness: '45%',
                vehicleMaintenance: '62%',
                crashIndicator: '72%' // Above 65% threshold (bad)
            },
            fleet: {
                size: 8,
                type: 'Dry Van, Reefer'
            },
            insurance: {
                autoLiability: '$1,000,000',
                cargo: '$100,000',
                expiration: '2023-12-31'
            }
        };
    }
    
    onComputerInteraction() {
        // Player interacted with a computer
        console.log('Computer interaction in scenario:', this.scenarioType);
        
        // Show the appropriate interface based on scenario type
        if (this.scenarioType === this.scenarioTypes.PHISHING_EMAIL) {
            this.showEmailInterface();
        } else if (this.scenarioType === this.scenarioTypes.FAKE_RATE_CONFIRMATION) {
            this.showRateConfirmationInterface();
        }
    }
    
    onPhoneInteraction() {
        // Player interacted with a phone
        console.log('Phone interaction in scenario:', this.scenarioType);
        
        // Show the partner verification interface
        if (this.scenarioType === this.scenarioTypes.PARTNER_VERIFICATION) {
            this.showPartnerVerificationInterface();
        } else {
            // Generic phone interface if not in partner verification scenario
            this.showGenericPhoneInterface();
        }
    }
    
    onFilingCabinetInteraction() {
        // Player interacted with the filing cabinet
        console.log('Filing cabinet interaction in scenario:', this.scenarioType);
        
        // Show a reference document interface
        this.showReferenceDocuments();
    }
    
    onPaperInteraction() {
        // Player interacted with papers on desk
        console.log('Paper interaction in scenario:', this.scenarioType);
        
        // Show notes about best practices
        this.showBestPracticesNotes();
    }
    
    onWhiteboardInteraction() {
        // Player interacted with the whiteboard
        console.log('Whiteboard interaction in scenario:', this.scenarioType);
        
        // Show industry statistics and fraud costs
        this.showIndustryStatistics();
    }
    
    showEmailInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        const email = this.currentScenario.content;
        
        computerInterface.innerHTML = `
            <div class="email-container">
                <div class="email-header">
                    <h2>Email</h2>
                    <button id="close-computer" class="btn">Close</button>
                </div>
                <div class="email-list">
                    <div class="email-item unread" id="scenario-email">
                        <span>${email.subject}</span>
                        <span>${email.date}</span>
                    </div>
                    <div class="email-item">
                        <span>Weekly Team Update</span>
                        <span>Yesterday</span>
                    </div>
                    <div class="email-item">
                        <span>Meeting Schedule</span>
                        <span>Yesterday</span>
                    </div>
                </div>
                <div class="email-content" id="email-content">
                    <h3>From: ${email.from}</h3>
                    <h3>Subject: ${email.subject}</h3>
                    <div class="email-body">
                        ${email.body}
                    </div>
                    ${email.attachments.length > 0 ? `<div class="email-attachments">
                        <h4>Attachments:</h4>
                        <ul>
                            ${email.attachments.map(attachment => `<li>${attachment}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                    <div class="email-actions">
                        <button id="email-report" class="btn">Report as Phishing</button>
                        <button id="email-respond" class="btn">Respond</button>
                        <button id="email-delete" class="btn">Delete</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for email interface
        document.getElementById('close-computer').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
        });
        
        document.getElementById('scenario-email').addEventListener('click', () => {
            document.getElementById('email-content').classList.add('active');
        });
        
        document.getElementById('email-report').addEventListener('click', () => {
            this.handleDecision('report');
        });
        
        document.getElementById('email-respond').addEventListener('click', () => {
            this.handleDecision('respond');
        });
        
        document.getElementById('email-delete').addEventListener('click', () => {
            this.handleDecision('delete');
        });
    }
    
    showRateConfirmationInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        const rateConf = this.currentScenario.content;
        
        computerInterface.innerHTML = `
            <div class="rate-confirmation">
                <div class="rate-confirmation-header">
                    <h2>Rate Confirmation #${rateConf.loadId}</h2>
                </div>
                
                <div class="rate-confirmation-section">
                    <h3>Broker Information</h3>
                    <p>Name: ${rateConf.broker.name}</p>
                    <p>MC#: ${rateConf.broker.mc}</p>
                    <p>Contact: ${rateConf.broker.contact}</p>
                    <p>Phone: ${rateConf.broker.phone}</p>
                    <p>Email: ${rateConf.broker.email}</p>
                </div>
                
                ${this.playerRole === 'broker' ? `
                <div class="rate-confirmation-section">
                    <h3>Carrier Information</h3>
                    <p>Name: ${rateConf.carrier.name}</p>
                    <p>MC#: ${rateConf.carrier.mc}</p>
                    <p>DOT#: ${rateConf.carrier.dot}</p>
                    <p>Contact: ${rateConf.carrier.contact}</p>
                    <p>Phone: ${rateConf.carrier.phone}</p>
                </div>` : ''}
                
                <div class="rate-confirmation-section">
                    <h3>Load Details</h3>
                    <table class="rate-confirmation-table">
                        <tr>
                            <th>Pick-up</th>
                            <th>Delivery</th>
                        </tr>
                        <tr>
                            <td>${rateConf.pickup.location}</td>
                            <td>${rateConf.delivery.location}</td>
                        </tr>
                        <tr>
                            <td>${rateConf.pickup.date} ${rateConf.pickup.time}</td>
                            <td>${rateConf.delivery.date} ${rateConf.delivery.time}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="rate-confirmation-section">
                    <h3>Rate Information</h3>
                    <p>Total Rate: ${rateConf.rate}</p>
                    <p>Payment Terms: ${rateConf.paymentTerms}</p>
                    <p>Notes: ${rateConf.notes}</p>
                </div>
                
                <div class="rate-confirmation-actions">
                    <button id="rate-approve" class="btn">Approve</button>
                    <button id="rate-reject" class="btn">Reject</button>
                    <button id="rate-verify" class="btn">Verify Details</button>
                    <button id="close-rate-confirmation" class="btn">Close</button>
                </div>
            </div>
        `;
        
        // Add event listeners for rate confirmation interface
        document.getElementById('close-rate-confirmation').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
        });
        
        document.getElementById('rate-approve').addEventListener('click', () => {
            this.handleDecision('approve');
        });
        
        document.getElementById('rate-reject').addEventListener('click', () => {
            this.handleDecision('reject');
        });
        
        document.getElementById('rate-verify').addEventListener('click', () => {
            this.handleDecision('verify');
        });
    }
    
    showPartnerVerificationInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        const profile = this.currentScenario.content;
        
        if (this.playerRole === 'carrier') {
            // Show broker profile for carriers
            computerInterface.innerHTML = `
                <div class="profile-card">
                    <div class="profile-header">
                        <h2>${profile.name}</h2>
                        <div>MC#: ${profile.mc}</div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>Business Information</h3>
                        <div class="profile-metric">
                            <span>Years in Business:</span>
                            <span>${profile.yearsInBusiness}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Address:</span>
                            <span>${profile.address}</span>
                        </div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>Credit Metrics</h3>
                        <div class="profile-metric">
                            <span>Ansonia Score:</span>
                            <span>${profile.creditMetrics.ansoniaScore}/100</span>
                        </div>
                        <div class="profile-metric">
                            <span>Average Days to Pay:</span>
                            <span>${profile.creditMetrics.daysToPay} days</span>
                        </div>
                        <div class="profile-metric">
                            <span>Payment History:</span>
                            <span>${profile.creditMetrics.paymentHistory}</span>
                        </div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>Contact Information</h3>
                        <div class="profile-metric">
                            <span>Name:</span>
                            <span>${profile.contactInfo.name}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Phone:</span>
                            <span>${profile.contactInfo.phone}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Email:</span>
                            <span>${profile.contactInfo.email}</span>
                        </div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>References</h3>
                        <div class="profile-metric">
                            <span>Number of References:</span>
                            <span>${profile.references.count}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Average Rating:</span>
                            <span>${profile.references.averageRating}</span>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button id="profile-approve" class="btn">Approve</button>
                        <button id="profile-reject" class="btn">Reject</button>
                        <button id="close-profile" class="btn">Close</button>
                    </div>
                </div>
            `;
        } else {
            // Show carrier profile for brokers
            computerInterface.innerHTML = `
                <div class="profile-card">
                    <div class="profile-header">
                        <h2>${profile.name}</h2>
                        <div>MC#: ${profile.mc} | DOT#: ${profile.dot}</div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>Business Information</h3>
                        <div class="profile-metric">
                            <span>Authority:</span>
                            <span>${profile.authority}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Address:</span>
                            <span>${profile.address}</span>
                        </div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>FMCSA Safety Metrics (BASIC Percentiles)</h3>
                        <div class="profile-metric">
                            <span>Unsafe Driving:</span>
                            <span>${profile.safetyMetrics.unsafeDriving}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Hours of Service:</span>
                            <span>${profile.safetyMetrics.hoursOfService}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Driver Fitness:</span>
                            <span>${profile.safetyMetrics.driverFitness}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Vehicle Maintenance:</span>
                            <span>${profile.safetyMetrics.vehicleMaintenance}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Crash Indicator:</span>
                            <span>${profile.safetyMetrics.crashIndicator}</span>
                        </div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>Fleet Information</h3>
                        <div class="profile-metric">
                            <span>Fleet Size:</span>
                            <span>${profile.fleet.size} trucks</span>
                        </div>
                        <div class="profile-metric">
                            <span>Equipment Types:</span>
                            <span>${profile.fleet.type}</span>
                        </div>
                    </div>
                    
                    <div class="profile-info">
                        <h3>Insurance Information</h3>
                        <div class="profile-metric">
                            <span>Auto Liability:</span>
                            <span>${profile.insurance.autoLiability}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Cargo:</span>
                            <span>${profile.insurance.cargo}</span>
                        </div>
                        <div class="profile-metric">
                            <span>Expiration:</span>
                            <span>${profile.insurance.expiration}</span>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button id="profile-approve" class="btn">Approve</button>
                        <button id="profile-reject" class="btn">Reject</button>
                        <button id="close-profile" class="btn">Close</button>
                    </div>
                </div>
            `;
        }
        
        // Add event listeners for profile interface
        document.getElementById('close-profile').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
        });
        
        document.getElementById('profile-approve').addEventListener('click', () => {
            this.handleDecision('approve');
        });
        
        document.getElementById('profile-reject').addEventListener('click', () => {
            this.handleDecision('reject');
        });
    }
    
    showGenericPhoneInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        computerInterface.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <h2>Phone Directory</h2>
                </div>
                <div class="profile-info">
                    <p>Use the phone to verify business partners and their credentials.</p>
                    <p>For carriers: Check broker credit ratings (Ansonia scores)</p>
                    <p>For brokers: Verify carrier safety scores (FMCSA BASICs)</p>
                </div>
                <button id="close-phone" class="btn">Close</button>
            </div>
        `;
        
        document.getElementById('close-phone').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
        });
    }
    
    showReferenceDocuments() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        if (this.playerRole === 'carrier') {
            computerInterface.innerHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Reference Guide: Broker Verification</h2>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Ansonia Credit Scores</h3>
                        <p>80-100: Excellent - Payment is highly reliable</p>
                        <p>60-79: Good - Generally pays on time</p>
                        <p>40-59: Fair - May have payment delays</p>
                        <p>0-39: Poor - High risk of non-payment</p>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Days to Pay Guidelines</h3>
                        <p>Under 30 days: Excellent</p>
                        <p>30-45 days: Acceptable</p>
                        <p>46-60 days: Concerning</p>
                        <p>Over 60 days: High risk</p>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Red Flags in Rate Confirmations</h3>
                        <ul>
                            <li>Incorrect or missing MC number</li>
                            <li>Email domain doesn't match company name</li>
                            <li>Unusual payment terms (over 45 days)</li>
                            <li>Vague pickup/delivery information</li>
                            <li>Unusually high rates (too good to be true)</li>
                        </ul>
                    </div>
                    <button id="close-reference" class="btn">Close</button>
                </div>
            `;
        } else {
            computerInterface.innerHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Reference Guide: Carrier Verification</h2>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>FMCSA BASIC Thresholds</h3>
                        <p>Unsafe Driving: 65% or higher is concerning</p>
                        <p>Hours of Service: 65% or higher is concerning</p>
                        <p>Driver Fitness: 80% or higher is concerning</p>
                        <p>Vehicle Maintenance: 80% or higher is concerning</p>
                        <p>Crash Indicator: 65% or higher is concerning</p>
                        <p>Lower percentiles are better. Exceeding these thresholds indicates increased risk.</p>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Insurance Requirements</h3>
                        <p>Auto Liability: Minimum $750,000 (typically $1,000,000)</p>
                        <p>Cargo Insurance: Minimum $100,000</p>
                        <p>Always verify coverage is current and not expired</p>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Double Brokering Warning Signs</h3>
                        <ul>
                            <li>Newly established authority (less than 1 year)</li>
                            <li>Carrier doesn't answer their published phone number</li>
                            <li>Rate negotiations conducted via text only</li>
                            <li>Pressure to make quick decisions</li>
                            <li>Difficulty providing references</li>
                        </ul>
                    </div>
                    <button id="close-reference" class="btn">Close</button>
                </div>
            `;
        }
        
        document.getElementById('close-reference').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
        });
    }
    
    showBestPracticesNotes() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        if (this.playerRole === 'carrier') {
            computerInterface.innerHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Carrier Security Notes</h2>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Email Security Best Practices</h3>
                        <ul>
                            <li>Always verify sender email addresses - look for misspellings or incorrect domains</li>
                            <li>Never click on suspicious links or open unexpected attachments</li>
                            <li>Be wary of urgent requests demanding immediate action</li>
                            <li>When in doubt, call the company directly using a known phone number (not one provided in the suspicious email)</li>
                            <li>Report phishing attempts to your IT department</li>
                        </ul>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Broker Verification Checklist</h3>
                        <ul>
                            <li>Verify MC number on the FMCSA website</li>
                            <li>Check Ansonia credit score and days-to-pay metrics</li>
                            <li>Get multiple references before working with a new broker</li>
                            <li>Confirm load details in writing (rate confirmation)</li>
                            <li>Be suspicious of rates that are too good to be true</li>
                        </ul>
                    </div>
                    <button id="close-notes" class="btn">Close</button>
                </div>
            `;
        } else {
            computerInterface.innerHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Broker Security Notes</h2>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Email Security Best Practices</h3>
                        <ul>
                            <li>Always verify sender email addresses - look for misspellings or incorrect domains</li>
                            <li>Never open unexpected attachments, especially executable files</li>
                            <li>Be suspicious of emails with urgent language or too-good-to-be-true offers</li>
                            <li>When in doubt, call the carrier directly using the number from a verified source</li>
                            <li>Enable two-factor authentication on all accounts</li>
                        </ul>
                    </div>
                    <div class="rate-confirmation-section">
                        <h3>Carrier Verification Checklist</h3>
                        <ul>
                            <li>Verify MC and DOT numbers on the FMCSA website</li>
                            <li>Check all BASIC safety scores</li>
                            <li>Verify active insurance with appropriate coverage levels</li>
                            <li>Call the carrier using the number listed on the FMCSA website</li>
                            <li>Document all verification steps taken</li>
                        </ul>
                    </div>
                    <button id="close-notes" class="btn">Close</button>
                </div>
            `;
        }
        
        document.getElementById('close-notes').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
        });
    }
    
    showIndustryStatistics() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        computerInterface.innerHTML = `
            <div class="rate-confirmation">
                <div class="rate-confirmation-header">
                    <h2>Freight Industry Fraud Statistics</h2>
                </div>
                <div class="rate-confirmation-section">
                    <h3>The Cost of Fraud</h3>
                    <ul>
                        <li>The average freight company loses approximately $400,000 annually to fraud</li>
                        <li>Double-brokering schemes cost the industry over $100 million per year</li>
                        <li>Phishing attacks against the transportation industry increased by 65% in the last year</li>
                        <li>The average cost of a cargo theft incident is $155,000</li>
                        <li>Over 70% of companies have experienced at least one fraud attempt in the past year</li>
                    </ul>
                </div>
                <div class="rate-confirmation-section">
                    <h3>Common Fraud Types in Freight</h3>
                    <ul>
                        <li>Identity theft (26% of cases)</li>
                        <li>Double-brokering (22% of cases)</li>
                        <li>Phishing and social engineering (19% of cases)</li>
                        <li>Fraudulent documentation (17% of cases)</li>
                        <li>Payment fraud (16% of cases)</li>
                    </ul>
                </div>
                <div class="rate-confirmation-section">
                    <h3>Preventing Fraud Saves Money</h3>
                    <p>Companies that implement comprehensive cybersecurity training report:</p>
                    <ul>
                        <li>75% reduction in successful phishing attempts</li>
                        <li>60% decrease in losses due to fraud</li>
                        <li>55% improvement in employee confidence handling suspicious situations</li>
                    </ul>
                </div>
                <button id="close-stats" class="btn">Close</button>
            </div>
        `;
        
        document.getElementById('close-stats').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
        });
    }
    
    handleDecision(action) {
        const computerInterface = document.getElementById('computer-interface');
        
        // Check if the action was correct
        const correct = action === this.currentScenario.correctAction;
        
        // Update score
        if (correct) {
            this.gameInstance.updateScore(10);
            this.fraudDetected = true;
        } else if (action === 'verify') {
            // Verifying details is always a safe action, even if not the final correct action
            this.gameInstance.updateScore(5);
        } else {
            this.gameInstance.updateScore(-5);
        }
        
        // Show feedback
        this.gameInstance.showFeedback(
            correct ? "Correct Decision!" : "Incorrect Decision",
            correct ? this.currentScenario.feedbackCorrect : this.currentScenario.feedbackIncorrect
        );
        
        // Hide the interface
        computerInterface.classList.add('hidden');
        
        // Load next scenario after a short delay
        setTimeout(() => {
            this.gameInstance.loadNextScenario();
        }, 3000);
    }
} 