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
            PARTNER_VERIFICATION: 'partner_verification',
            PHISHING_CALL: 'phishing_call',
            SUSPICIOUS_INVOICE: 'suspicious_invoice',
            LEGITIMATE_EMAIL: 'legitimate_email',
            LEGITIMATE_RATE_CONFIRMATION: 'legitimate_rate_confirmation',
            FAKE_LOAD_OFFER: 'fake_load_offer',
            SUSPICIOUS_LOAD_POSTING: 'suspicious_load_posting',
            BROKER_PAYMENT_VERIFICATION: 'broker_payment_verification',
            LOAD_DETAIL_CONFIRMATION: 'load_detail_confirmation',
            CARRIER_IDENTITY_VERIFICATION: 'carrier_identity_verification',
            LOAD_CONFIRMATION_CALL: 'load_confirmation_call'
        };
        
        // Carrier-specific scenarios
        this.carrierScenarios = [
            {
                type: this.scenarioTypes.PHISHING_EMAIL,
                title: 'Fake Load Offer Email',
                content: {
                    from: 'shipper@loadlinkk.com', 
                    subject: 'High-Paying Load Available - $10,000',
                    date: 'Today, 9:15 AM',
                    body: `<p>Dear Valued Carrier,</p>
                    <p>We have an <strong>URGENT</strong> high-paying load that needs to be moved TODAY. The rate is $10,000 for a standard haul.</p>
                    <p>Please <a href="#" class="suspicious-link">click here</a> to accept this load immediately before it's assigned to another carrier.</p>
                    <p>We need your bank information to process the payment advance.</p>
                    <p>Regards,<br>John Smith<br>Load Dispatch</p>`,
                    attachments: []
                },
                correctAction: 'report',
                feedbackCorrect: 'Excellent! You identified this phishing attempt correctly. Red flags include: 1) The misspelled domain "loadlinkk.com" (extra "k"), 2) The unusually high rate ($10,000) for a standard haul, 3) The urgent request requiring immediate action, and 4) The suspicious request for bank information. These are classic phishing tactics in the freight industry.',
                feedbackIncorrect: 'This was a dangerous phishing email. Notice the red flags: 1) The misspelled domain "loadlinkk.com" (extra "k"), 2) The unusually high rate ($10,000) for a standard haul, 3) The urgent request requiring immediate action, and 4) The suspicious request for bank information. Freight industry research shows these tactics are commonly used to steal carrier credentials and banking information.'
            },
            {
                type: this.scenarioTypes.SUSPICIOUS_LOAD_POSTING,
                title: 'Broker Credit Check',
                content: {
                    brokerName: 'FastFreight Solutions',
                    creditScore: 45,
                    daysToPayAverage: 60,
                    loadDetails: {
                        origin: 'Chicago, IL',
                        destination: 'Atlanta, GA',
                        rate: '$8,000',
                        distance: '700 miles',
                        weight: '42,000 lbs',
                        equipment: 'Dry Van'
                    },
                    reviews: [
                        { text: 'Payment delayed by 75 days', rating: '1/5' },
                        { text: 'Had to file against bond to get paid', rating: '1/5' },
                        { text: 'Paid eventually but very slow', rating: '2/5' }
                    ]
                },
                correctAction: 'reject',
                feedbackCorrect: 'Great decision! You wisely avoided a high-risk broker. Their Ansonia credit score of 45 (below 60 is concerning) and 60-day average payment terms exceed industry standards of 30 days. The reviews mentioning payment delays and bond claims are serious red flags. According to industry data, brokers with scores below 60 account for 78% of non-payment claims.',
                feedbackIncorrect: 'This broker presented significant payment risks you should have noticed. The Ansonia credit score of 45 is poor (scores below 60 are concerning), and their 60-day average payment terms exceed the 30-day industry standard. The negative reviews about payment delays and bond claims are serious warning signs. Always verify broker credit ratings to protect your business from non-payment.'
            },
            {
                type: this.scenarioTypes.BROKER_PAYMENT_VERIFICATION,
                title: 'Payment Terms Verification Call',
                content: {
                    brokerName: 'Prime Loadz Inc.',
                    creditScore: 55,
                    daysToPayAverage: 45,
                    loadDetails: {
                        origin: 'Dallas, TX',
                        destination: 'Phoenix, AZ',
                        rate: '$2,800',
                        equipment: 'Reefer'
                    },
                    callTranscript: [
                        { speaker: 'Broker', text: 'Prime Loadz, this is Mike. How can I help you?' },
                        { speaker: 'You', text: 'Hi, I&apos;m calling about the load from Dallas to Phoenix. I wanted to confirm the payment terms.' },
                        { speaker: 'Broker', text: 'Sure, we typically pay in 45 days after receiving clean paperwork.' },
                        { speaker: 'You', text: 'That&apos;s longer than the 30-day terms mentioned in your profile.' },
                        { speaker: 'Broker', text: 'Well, we&apos;re a bit backed up right now. But for you, we could do 40 days as a special favor.' },
                        { speaker: 'Broker', text: 'We can also offer QuickPay for 5% if you need the money faster.' }
                    ]
                },
                correctAction: 'reject',
                feedbackCorrect: 'Good judgment! You avoided a broker with questionable payment practices. Their credit score of 55 is below the recommended minimum of 80, and their payment terms exceed the standard 30 days. Their inconsistent information about payment terms during the call and the sudden offer of QuickPay (at a steep 5% fee) are additional warning signs. Always verify payment terms before accepting loads.',
                feedbackIncorrect: 'You should have rejected this broker based on several warning signs. Their credit score of 55 is below the recommended minimum of 80, and their payment terms of 45 days exceed the industry standard of 30 days. Their inconsistent information about payment terms during the call and the predatory QuickPay offer (5% fee is excessive) indicate cash flow problems. Industry best practices recommend confirming payment terms before accepting loads.'
            },
            {
                type: this.scenarioTypes.LOAD_DETAIL_CONFIRMATION,
                title: 'Load Detail Confirmation Call',
                content: {
                    brokerName: 'Global Logistics LLC',
                    loadDetails: {
                        origin: 'Memphis, TN',
                        destination: 'Denver, CO',
                        rate: '$3,200',
                        equipment: 'Dry Van'
                    },
                    callTranscript: [
                        { speaker: 'Broker', text: 'Global Logistics, this is Sarah.' },
                        { speaker: 'You', text: 'Hi Sarah, I&apos;m calling about the Memphis to Denver load. I just wanted to confirm the pickup address.' },
                        { speaker: 'Broker', text: 'Oh, there&apos;s actually been a slight change. The pickup is now in Little Rock, not Memphis.' },
                        { speaker: 'You', text: 'That&apos;s different from what&apos;s in the rate confirmation.' },
                        { speaker: 'Broker', text: 'Yes, it&apos;s a last-minute change. But don&apos;t worry, the rate is the same.' },
                        { speaker: 'Broker', text: 'Also, while I have you, can you give me your MC number and bank account details again? We need to update our system.' }
                    ]
                },
                correctAction: 'report',
                feedbackCorrect: 'Excellent decision! You correctly identified multiple red flags: 1) The changed pickup location without a new rate confirmation, 2) The retention of the same rate despite a significant location change, and 3) The suspicious request for MC number and banking details. These are common tactics in freight fraud where bad actors try to get carriers to accept different load terms while collecting sensitive information.',
                feedbackIncorrect: 'This call contained several warning signs of fraud: 1) The changed pickup location without a new rate confirmation, 2) The retention of the same rate despite a significant location change (Memphis to Little Rock), and 3) The suspicious request for MC number and banking details. Never provide sensitive information during unexpected calls, and always get location changes in writing with updated rate confirmations.'
            },
            {
                type: this.scenarioTypes.FAKE_RATE_CONFIRMATION,
                title: 'Rate Confirmation Discrepancy',
                content: {
                    brokerName: 'Acme Freight',
                    brokerMC: 'MC-654321',
                    originalRate: '$2,000',
                    alteredRate: '$1,800',
                    contactEmail: 'support@acmefreightt.com',
                    pickupDate: '04/15/2023',
                    deliveryDate: '04/17/2023',
                    origin: 'Seattle, WA',
                    destination: 'Portland, OR'
                },
                correctAction: 'reject',
                feedbackCorrect: 'Great catch! You identified two critical discrepancies: 1) The rate is $200 lower than the agreed $2,000, and 2) The email domain contains a suspicious misspelling ("acmefreightt.com" with an extra "t"). These are common tactics in freight fraud where altered rate confirmations are used to pay carriers less than agreed or redirect payments to fraudulent accounts.',
                feedbackIncorrect: 'You missed two important discrepancies: 1) The rate shown ($1,800) is lower than the agreed $2,000, and 2) The email domain contains a suspicious misspelling ("acmefreightt.com" with an extra "t"). Always verify rates match verbal agreements and check email domains carefully. Research shows that rate confirmation fraud costs carriers an average of $1,200 per incident.'
            },
            {
                type: this.scenarioTypes.LEGITIMATE_RATE_CONFIRMATION,
                title: 'Legitimate Rate Confirmation',
                content: this.generateLegitimateRateConfirmation('carrier'),
                correctAction: 'accept',
                feedbackCorrect: 'Good work! This is a legitimate rate confirmation with all details matching your records. The broker information is accurate, the payment terms are standard, and there are no suspicious elements or discrepancies. According to industry best practices, always verify rate confirmations before accepting loads, but also recognize legitimate documents to maintain efficient operations.',
                feedbackIncorrect: 'This was actually a legitimate rate confirmation with no red flags. All details matched standard industry expectations, and the document contained no suspicious elements or discrepancies. Being able to distinguish between legitimate documents and fraudulent ones is critical for efficient operations while maintaining security.'
            },
            {
                type: this.scenarioTypes.PARTNER_VERIFICATION,
                title: 'Broker Profile Review',
                content: this.generateBrokerProfile(),
                correctAction: 'reject',
                feedbackCorrect: 'Excellent! You correctly identified a high-risk broker. Their Ansonia credit score of 42 indicates poor payment history (below the recommended 80 minimum), and their 60+ days to pay is well above the industry standard of 30 days. Freight industry research indicates that brokers with credit scores below 50 have a 65% higher rate of payment default.',
                feedbackIncorrect: 'This broker had several red flags you should have noticed. Their Ansonia credit score of 42 indicates poor payment history (scores should be at least 80), and their 60+ days to pay is double the industry standard of 30 days. According to industry data, working with brokers with credit scores below 50 increases your risk of non-payment by 65%.'
            },
            {
                type: this.scenarioTypes.PARTNER_VERIFICATION,
                title: 'Broker Verification - Reliable Broker',
                content: this.generateLegitBrokerProfile(),
                correctAction: 'accept',
                feedbackCorrect: 'Good decision! This broker has a strong credit score (91/100) and pays within 21 days on average, which is better than the industry standard of 30-45 days. Their strong payment history and verified contact information make them a reliable business partner according to industry best practices.',
                feedbackIncorrect: 'This was actually a reliable broker with a strong credit score (91/100) and prompt payment history (21 days on average). Their score exceeds the recommended minimum of 80, and their payment terms are better than the industry standard of 30 days. Recognizing trustworthy partners is just as important as identifying risky ones.'
            }
        ];
        
        // Broker-specific scenarios
        this.brokerScenarios = [
            {
                type: this.scenarioTypes.PHISHING_EMAIL,
                title: 'Suspicious Email from Carrier',
                content: {
                    from: 'support@freightfindr.com', 
                    subject: 'Urgent: Verify Payment for Load #12345',
                    date: 'Today, 10:22 AM',
                    body: `<p>Dear Broker,</p>
                    <p>We are contacting you regarding Load #12345 that has been accepted by our carrier.</p>
                    <p>Due to an <strong>URGENT</strong> situation, we need immediate payment verification to release the load. Please <a href="#" class="suspicious-link">click here</a> to verify your payment method and proceed with the delivery.</p>
                    <p>If payment is not verified within 2 hours, the load will be released to another broker.</p>
                    <p>Thank you for your cooperation,<br>Support Team</p>`,
                    attachments: []
                },
                correctAction: 'report',
                feedbackCorrect: 'Excellent! You correctly identified this as a phishing attempt. The red flags include: 1) The domain "freightfindr.com" is misspelled (legitimate would be "freightfinder.com"), 2) The urgent request demanding immediate action, 3) The suspicious payment verification link, and 4) The threat of releasing the load. These are common tactics used to steal broker payment information.',
                feedbackIncorrect: 'This was a dangerous phishing email. The domain "freightfindr.com" is misspelled (should be "freightfinder.com"), and the urgent request demanding immediate payment verification is a classic phishing tactic. The threat of releasing the load creates false urgency. According to industry research, over 60% of freight brokers have been targeted by similar phishing attempts.'
            },
            {
                type: this.scenarioTypes.CARRIER_IDENTITY_VERIFICATION,
                title: 'Carrier Identity Verification Call',
                content: {
                    carrierName: 'FastFreight LLC',
                    registeredMC: 'MC-789012',
                    claimedMC: 'MC-789021',
                    callTranscript: [
                        { speaker: 'Carrier', text: 'Hello, this is FastFreight LLC. I&apos;m calling about the load from Boston to New York.' },
                        { speaker: 'You', text: 'Hi, I&apos;d like to verify some information. What&apos;s your MC number?' },
                        { speaker: 'Carrier', text: 'It&apos;s MC-789021.' },
                        { speaker: 'You', text: 'And what&apos;s the phone number registered with your authority?' },
                        { speaker: 'Carrier', text: 'Um, I&apos;m not sure. I&apos;m calling from my personal line. Listen, we need to move quickly on this load.' },
                        { speaker: 'Carrier', text: 'Can you just text me the pickup details and send the advance to our new account? I&apos;ll send you the details.' }
                    ]
                },
                correctAction: 'report',
                feedbackCorrect: 'Excellent decision! You identified multiple red flags: 1) The provided MC number (MC-789021) doesn&apos;t match the registered one (MC-789012), 2) The caller couldn&apos;t verify their registered phone number, 3) The push for urgency to bypass verification, and 4) The suspicious request for an advance to a "new account." These are common tactics in identity theft schemes targeting brokers.',
                feedbackIncorrect: 'This call contained several warning signs of fraud: 1) The MC number provided (MC-789021) doesn&apos;t match the registered one (MC-789012), 2) The caller couldn&apos;t verify their registered contact information, 3) The unusual urgency, and 4) The request for payment to a new account. Industry best practices require verifying carrier identity through FMCSA-registered information before sharing load details or sending payments.'
            },
            {
                type: this.scenarioTypes.LOAD_CONFIRMATION_CALL,
                title: 'Load Confirmation Call with Carrier',
                content: {
                    carrierName: 'QuickHaul LLC',
                    agreedRate: '$3,000',
                    claimedRate: '$4,000',
                    callTranscript: [
                        { speaker: 'Carrier', text: 'Hi, this is QuickHaul LLC. I&apos;m calling to confirm the details for tomorrow&apos;s load.' },
                        { speaker: 'You', text: 'Sure, I have it as Chicago to Indianapolis, rate of $3,000, pickup at 9 AM.' },
                        { speaker: 'Carrier', text: 'Actually, I have the rate as $4,000, not $3,000.' },
                        { speaker: 'You', text: 'That&apos;s not what we agreed to. The rate confirmation I sent shows $3,000.' },
                        { speaker: 'Carrier', text: 'Maybe there was a misunderstanding. But listen, we need an advance of $1,000 to secure the truck for tomorrow.' },
                        { speaker: 'Carrier', text: 'Can you wire that to our account today? It&apos;s a different account from the one on file.' }
                    ]
                },
                correctAction: 'reject',
                feedbackCorrect: 'Good decision! You identified several suspicious behaviors: 1) The carrier claimed a different rate ($4,000) than the agreed one ($3,000), 2) They requested an advance payment (unusual in standard transactions), and 3) They asked for payment to an account different from the one on file. These are common tactics in double-brokering and payment fraud schemes.',
                feedbackIncorrect: 'You missed several warning signs in this call: 1) The carrier claimed a different rate ($4,000) than what was documented ($3,000), 2) They requested an advance payment (unusual in most legitimate transactions), and 3) They asked for payment to a different account than the one on file. Industry best practices recommend rejecting transactions with changed terms or suspicious payment requests.'
            },
            {
                type: this.scenarioTypes.PARTNER_VERIFICATION,
                title: 'Carrier Profile Review - Double-Brokering Risk',
                content: {
                    carrierName: 'Reliable Transports Inc.',
                    yearsInBusiness: 2,
                    csaScores: {
                        unsafeDriving: '75%',
                        hoursOfServiceCompliance: '82%',
                        vehicleMaintenance: '80%',
                        substanceAbuse: '65%'
                    },
                    reviews: [
                        { text: 'Late delivery, poor communication', rating: '2/5' },
                        { text: 'Load arrived damaged', rating: '1/5' },
                        { text: 'Different truck showed up than what was assigned', rating: '2/5' }
                    ]
                },
                correctAction: 'reject',
                feedbackCorrect: 'Great decision! You correctly identified a high-risk carrier. Their CSA scores exceed FMCSA thresholds (especially HOS at 82% and Unsafe Driving at 75%, both above the 65% threshold), indicating safety concerns. The review mentioning "Different truck showed up than what was assigned" is a classic sign of double-brokering. Industry research indicates carriers with HOS violations above 65% are 3.5 times more likely to be involved in double-brokering.',
                feedbackIncorrect: 'This carrier profile showed several red flags: 1) CSA scores above FMCSA intervention thresholds (HOS at 82% and Unsafe Driving at 75%, both above the 65% threshold), 2) Poor reviews about delivery and damage, and 3) The critical review about a "different truck showing up" is a major indication of double-brokering activity. Always verify carrier safety scores through the FMCSA portal before assigning loads.'
            },
            {
                type: this.scenarioTypes.PARTNER_VERIFICATION,
                title: 'Carrier Safety Score Verification',
                content: this.generateCarrierProfile(),
                correctAction: 'reject',
                feedbackCorrect: 'Good decision! This carrier has serious safety issues with an Unsafe Driving BASIC score of 87% (above the 65% threshold) and a Crash Indicator of 72%. According to FMCSA data, carriers exceeding threshold values in these categories are significantly more likely to be involved in accidents. Additionally, carriers with poor safety scores are 2.3 times more likely to engage in fraudulent activities like double-brokering or insurance fraud.',
                feedbackIncorrect: 'You missed serious safety concerns with this carrier. Their Unsafe Driving BASIC score of 87% and Crash Indicator of 72% both exceed FMCSA intervention thresholds (65%). Research shows carriers with scores above these thresholds are not only safety risks but also 2.3 times more likely to engage in fraudulent activities like double-brokering or insurance fraud.'
            },
            {
                type: this.scenarioTypes.PARTNER_VERIFICATION,
                title: 'Carrier Verification - Safe Carrier',
                content: this.generateSafeCarrierProfile(),
                correctAction: 'accept',
                feedbackCorrect: 'Excellent! You correctly identified a safe carrier partner. Their safety scores are well within acceptable ranges (all below 65%), and they have active insurance with appropriate coverage levels. The consistent positive reviews and verifiable operating history make them a reliable partner according to industry best practices.',
                feedbackIncorrect: 'This was actually a safe carrier with acceptable safety scores (all below FMCSA intervention thresholds of 65%) and proper insurance coverage. Their positive reviews and verifiable operating history indicate a reliable partner. Recognizing legitimate carriers is just as important as identifying fraudulent ones.'
            },
            {
                type: this.scenarioTypes.FAKE_RATE_CONFIRMATION,
                title: 'Rate Confirmation Authentication',
                content: {
                    carrierName: 'Global Logistix',
                    correctSpelling: 'Global Logistics',
                    loadNumber: '98765',
                    rate: '$2,500',
                    origin: 'Kansas City, MO',
                    destination: 'St. Louis, MO',
                    pickupDate: '05/12/2023',
                    deliveryDate: '05/13/2023',
                    fontInconsistencies: true
                },
                correctAction: 'reject',
                feedbackCorrect: 'Great catch! You correctly identified a forged document with: 1) A misspelled broker name ("Global Logistix" instead of "Global Logistics"), and 2) Font inconsistencies throughout the document. According to industry data, document forgery is involved in 40% of double-brokering cases, with subtle misspellings being a common tactic.',
                feedbackIncorrect: 'This was a forged rate confirmation with several indicators: 1) The broker name was misspelled ("Global Logistix" instead of "Global Logistics"), and 2) There were font inconsistencies throughout the document. Document verification is critical in preventing double-brokering and payment diversion schemes. Always check for spelling errors and visual inconsistencies in documents.'
            },
            {
                type: this.scenarioTypes.LEGITIMATE_RATE_CONFIRMATION,
                title: 'Legitimate Rate Confirmation',
                content: this.generateLegitimateRateConfirmation('broker'),
                correctAction: 'accept',
                feedbackCorrect: 'Good work! This rate confirmation is legitimate with all details matching your records. The carrier information is accurate, the document formatting is consistent, and there are no suspicious elements. According to industry best practices, always verify documents but also recognize legitimate ones to maintain efficient operations.',
                feedbackIncorrect: 'This was actually a legitimate rate confirmation. All information matched your records, the document formatting was consistent, and there were no suspicious elements. Being able to correctly distinguish legitimate documents from fraudulent ones is essential for maintaining efficient operations while ensuring security.'
            }
        ];
        
        // All scenarios
        this.allScenarios = {
            'carrier': this.carrierScenarios,
            'broker': this.brokerScenarios
        };
        
        console.log('Scenario initialized with player role:', playerRole);
    }
    
    initialize(gameInstance) {
        if (!gameInstance) {
            console.error('Cannot initialize scenario: No game instance provided');
            return false;
        }
        
        this.gameInstance = gameInstance;
        
        // Verify player role is valid
        if (this.playerRole !== 'carrier' && this.playerRole !== 'broker') {
            console.error(`Invalid player role: ${this.playerRole}`);
            return false;
        }
        
        // Make sure we have scenarios available for the player role
        let scenarioList = this.playerRole === 'carrier' ? this.carrierScenarios : this.brokerScenarios;
        
        if (!scenarioList || scenarioList.length === 0) {
            console.error(`No scenarios available for role: ${this.playerRole}`);
            return false;
        }
        
        // Select a random scenario based on player role
        try {
            this.currentScenario = this.getRandomScenario(scenarioList);
            
            if (!this.currentScenario || !this.currentScenario.type) {
                console.error('Failed to get valid scenario');
                return false;
            }
            
            this.scenarioType = this.currentScenario.type;
            console.log(`Initialized scenario: ${this.scenarioType}`);
            return true;
        } catch (e) {
            console.error('Error initializing scenario:', e);
            return false;
        }
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
            name: 'Discount Freight Services',
            mc: '567890',
            address: '123 Freight Lane, St. Louis, MO 63101',
            established: '2021',
            creditScore: {
                ansonia: '42', // Poor score (out of 100)
                averageDaysToPay: '68' // Very slow payment
            },
            references: [
                { name: 'Previous Carrier', contact: '(555) 111-2222' }
            ],
            insurance: {
                contingentCargo: '$100,000',
                bondAmount: '$25,000'
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
        // Player interacted with the computer
        console.log('Computer interaction in scenario:', this.scenarioType);
        
        // Make sure we have a valid game instance
        if (!this.gameInstance) {
            console.error('No game instance available for computer interaction');
            return;
        }
        
        // Unlock controls to show cursor if they exist
        if (this.gameInstance.controls) {
            try {
                this.gameInstance.controls.unlock();
            } catch (e) {
                console.warn('Error unlocking controls:', e);
            }
        }
        
        // Show the appropriate interface based on scenario type
        if (this.scenarioType === this.scenarioTypes.PHISHING_EMAIL || 
            this.scenarioType === this.scenarioTypes.LEGITIMATE_EMAIL ||
            this.scenarioType === this.scenarioTypes.FAKE_LOAD_OFFER) {
            this.showEmailInterface();
        } else if (this.scenarioType === this.scenarioTypes.FAKE_RATE_CONFIRMATION || 
                   this.scenarioType === this.scenarioTypes.LEGITIMATE_RATE_CONFIRMATION) {
            this.showRateConfirmationInterface();
        } else if (this.scenarioType === this.scenarioTypes.PARTNER_VERIFICATION ||
                  this.scenarioType === this.scenarioTypes.SUSPICIOUS_LOAD_POSTING) {
            // For partner verification scenarios, show the partner verification interface
            this.showPartnerVerificationInterface();
        } else if (this.scenarioType === this.scenarioTypes.SUSPICIOUS_INVOICE) {
            // For suspicious invoice scenarios, show the invoice interface
            this.showInvoiceInterface();
        } else if (this.scenarioType === this.scenarioTypes.PHISHING_CALL ||
                  this.scenarioType === this.scenarioTypes.CARRIER_IDENTITY_VERIFICATION ||
                  this.scenarioType === this.scenarioTypes.LOAD_CONFIRMATION_CALL) {
            // Even though this is a call scenario, we might want to show emails related to it
            this.showEmailInterface();
        } else {
            // Fallback for unknown scenario types
            console.warn('Unknown scenario type for computer interaction:', this.scenarioType);
            this.showEmailInterface(); // Default to email interface
        }
    }
    
    onPhoneInteraction() {
        // Player interacted with a phone
        console.log('Phone interaction in scenario:', this.scenarioType);
        
        // Make sure we have a valid game instance
        if (!this.gameInstance) {
            console.error('No game instance available for phone interaction');
            return;
        }
        
        // Unlock controls to show cursor if they exist
        if (this.gameInstance.controls) {
            try {
                this.gameInstance.controls.unlock();
            } catch (e) {
                console.warn('Error unlocking controls:', e);
            }
        }
        
        // Show the appropriate interface based on scenario type
        if (this.scenarioType === this.scenarioTypes.PHISHING_CALL ||
           this.scenarioType === this.scenarioTypes.CARRIER_IDENTITY_VERIFICATION ||
           this.scenarioType === this.scenarioTypes.LOAD_CONFIRMATION_CALL ||
           this.scenarioType === this.scenarioTypes.BROKER_PAYMENT_VERIFICATION ||
           this.scenarioType === this.scenarioTypes.LOAD_DETAIL_CONFIRMATION) {
            this.showPhishingCallInterface();
        } else if (this.scenarioType === this.scenarioTypes.PARTNER_VERIFICATION ||
                 this.scenarioType === this.scenarioTypes.SUSPICIOUS_LOAD_POSTING) {
            // For partner verification, show the partner verification interface on the phone
            this.showPartnerVerificationInterface();
        } else if (this.scenarioType === this.scenarioTypes.PHISHING_EMAIL || 
                  this.scenarioType === this.scenarioTypes.LEGITIMATE_EMAIL ||
                  this.scenarioType === this.scenarioTypes.FAKE_LOAD_OFFER) {
            // For email scenarios, show an email interface on the phone
            this.showMobileEmailInterface();
        } else if (this.scenarioType === this.scenarioTypes.FAKE_RATE_CONFIRMATION || 
                  this.scenarioType === this.scenarioTypes.LEGITIMATE_RATE_CONFIRMATION) {
            // For rate confirmation scenarios, show a mobile version of the rate confirmation
            this.showMobileRateConfirmationInterface();
        } else if (this.scenarioType === this.scenarioTypes.SUSPICIOUS_INVOICE) {
            this.showMobileInvoiceInterface();
        } else {
            // Fallback for other scenario types
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
        computerInterface.classList.add('active'); // Mark as active to prevent pointer lock issues
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for email interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="email-container">
                    <div class="email-header">
                        <h2>Email</h2>
                        <button id="close-computer" class="btn">Close</button>
                    </div>
                    <div class="email-list">
                        <div class="email-item unread">
                            <span>Error: No emails available</span>
                            <span>Now</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-computer').addEventListener('click', () => {
                computerInterface.classList.remove('active');
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const email = this.currentScenario.content;
        
        console.log('Showing email interface with content:', email);
        
        // Create the email interface HTML with improved visual cues and instructions
        let emailHTML = `
            <div class="email-container">
                <div class="email-header">
                    <h2>Email</h2>
                    <div class="task-instruction">
                        <p>Examine this email for signs of fraud or phishing. Look for suspicious domains, urgent language, or unusual requests.</p>
                    </div>
                    <button id="close-computer" class="btn">Close</button>
                </div>
                <div class="email-interface">
                    <div class="email-list">
                        <div class="email-item unread current" id="scenario-email">
                            <span class="email-sender">${email.from ? email.from.split('@')[0] : 'Unknown'}</span>
                            <span class="email-subject">${email.subject || 'No Subject'}</span>
                            <span class="email-date">${email.date || 'Today'}</span>
                        </div>
                        <div class="email-item">
                            <span class="email-sender">Weekly Updates</span>
                            <span class="email-subject">Team Meeting Notes</span>
                            <span class="email-date">Yesterday</span>
                        </div>
                        <div class="email-item">
                            <span class="email-sender">System Admin</span>
                            <span class="email-subject">Meeting Schedule</span>
                            <span class="email-date">Yesterday</span>
                        </div>
                    </div>
                    <div class="email-content active" id="email-content">
                        <div class="email-details">
                            <div class="email-detail"><strong>From:</strong> <span class="${this.isPhishingDomain(email.from) ? 'suspicious-domain' : ''}">${email.from || 'Unknown Sender'}</span></div>
                            <div class="email-detail"><strong>To:</strong> you@yourcompany.com</div>
                            <div class="email-detail"><strong>Subject:</strong> ${email.subject || 'No Subject'}</div>
                            <div class="email-detail"><strong>Date:</strong> ${email.date || 'Today'}</div>
                        </div>
                        <div class="email-body">
                            ${email.body || 'No content available'}
                        </div>
                        ${email.attachments && email.attachments.length > 0 ? `
                        <div class="email-attachments">
                            <h4>Attachments:</h4>
                            <ul>
                                ${email.attachments.map(attachment => `
                                <li class="${this.isSuspiciousAttachment(attachment) ? 'suspicious-attachment' : ''}">
                                    ${attachment}
                                    ${this.isSuspiciousAttachment(attachment) ? 
                                    '<span class="attachment-warning">(Warning: This file type may be dangerous)</span>' : ''}
                                </li>`).join('')}
                            </ul>
                        </div>` : ''}
                        <div class="email-actions">
                            <div class="action-instructions">
                                <p>What would you like to do with this email?</p>
                            </div>
                            <div class="action-buttons">
                                <button id="email-report" class="btn danger-btn" title="Report this as a phishing email if you suspect fraud">Report as Phishing</button>
                                <button id="email-respond" class="btn" title="Respond to this email">Respond</button>
                                <button id="email-accept" class="btn safe-btn" title="Accept this as a legitimate email">Accept as Legitimate</button>
                                <button id="email-delete" class="btn" title="Delete this email">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Set the HTML content
        computerInterface.innerHTML = emailHTML;
        
        // Add event listeners
        document.getElementById('close-computer').addEventListener('click', () => {
            computerInterface.classList.remove('active');
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing the interface
            if (this.gameInstance && this.gameInstance.controls) {
                try {
                    setTimeout(() => {
                        this.gameInstance.controls.lock();
                    }, 100);
                } catch (e) {
                    console.warn('Error locking controls after closing email:', e);
                }
            }
        });
        
        document.getElementById('scenario-email').addEventListener('click', function() {
            console.log('Email clicked');
            const emailContent = document.getElementById('email-content');
            emailContent.classList.add('active');
        });
        
        document.getElementById('email-report').addEventListener('click', () => {
            this.handleDecision('report');
        });
        
        document.getElementById('email-respond').addEventListener('click', () => {
            this.handleDecision('respond');
        });
        
        document.getElementById('email-accept').addEventListener('click', () => {
            this.handleDecision('accept');
        });
        
        document.getElementById('email-delete').addEventListener('click', () => {
            this.handleDecision('delete');
        });
    }
    
    // Helper methods to check for suspicious elements
    isPhishingDomain(email) {
        if (!email) return false;
        
        // Common phishing signs in email domains
        const suspiciousPatterns = [
            'secure-', '-secure', 'security', 'verify', 'alert',
            'update', 'login', 'account', '.co' // .co can be mistaken for .com
        ];
        
        // Check if the domain contains suspicious patterns
        const domain = email.split('@')[1];
        if (!domain) return false;
        
        // Check for misspellings of common domains
        const commonMisspellings = {
            'loadbord': 'loadboard',
            'freightfindr': 'freightfinder',
            'carriercheck.co': 'suspicious domain',
            'eliteship.net': 'suspicious domain' // Elite Logistics should use elitelogistics.com
        };
        
        for (const misspelled in commonMisspellings) {
            if (domain.includes(misspelled)) {
                return true;
            }
        }
        
        for (const pattern of suspiciousPatterns) {
            if (domain.includes(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    isSuspiciousAttachment(attachment) {
        if (!attachment) return false;
        
        // List of suspicious file extensions
        const suspiciousExtensions = [
            '.exe', '.bat', '.cmd', '.scr', '.js', '.vbs', '.dll', '.jar',
            '.msi', '.pif', '.hta', '.pdf.exe' // Disguised executable
        ];
        
        for (const ext of suspiciousExtensions) {
            if (attachment.toLowerCase().endsWith(ext)) {
                return true;
            }
        }
        
        return false;
    }

    showRateConfirmationInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        computerInterface.classList.add('active');
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for rate confirmation interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Rate Confirmation</h2>
                    </div>
                    <div class="rate-confirmation-section">
                        <p>Rate confirmation data unavailable.</p>
                    </div>
                    <button id="close-rate" class="btn">Close</button>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-rate').addEventListener('click', () => {
                computerInterface.classList.remove('active');
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const rateConf = this.currentScenario.content;
        console.log('Showing rate confirmation interface with content:', rateConf);
        
        // Determine if we're showing broker or carrier information based on role
        const isBroker = this.playerRole === 'broker';
        
        // Build the interface HTML with improved instructions and visual cues
        let rateConfHTML = `
            <div class="rate-confirmation">
                <div class="rate-confirmation-header">
                    <h2>Rate Confirmation #${rateConf.loadId || 'Unknown'}</h2>
                    <div class="task-instruction">
                        <p>Verify this rate confirmation for accuracy. Look for inconsistencies in broker information, payment terms, and other details.</p>
                    </div>
                </div>
                
                <div class="rate-confirmation-content">
                    <div class="rate-confirmation-section">
                        <h3>${isBroker ? 'Broker' : 'Broker'} Information</h3>
                        <p>Name: ${rateConf.broker?.name || 'N/A'}</p>
                        <p>MC#: <span class="${this.isSuspiciousMC(rateConf.broker?.mc) ? 'suspicious-detail' : ''}">${rateConf.broker?.mc || 'N/A'}</span>
                           ${this.isSuspiciousMC(rateConf.broker?.mc) ? '<span class="warning-icon" title="Verify this MC number">⚠️</span>' : ''}
                        </p>
                        <p>Contact: ${rateConf.broker?.contact || 'N/A'}</p>
                        <p>Phone: ${rateConf.broker?.phone || 'N/A'}</p>
                        <p>Email: <span class="${this.isPhishingDomain(rateConf.broker?.email) ? 'suspicious-detail' : ''}">${rateConf.broker?.email || 'N/A'}</span>
                           ${this.isPhishingDomain(rateConf.broker?.email) ? '<span class="warning-icon" title="Email domain does not match company name">⚠️</span>' : ''}
                        </p>
                    </div>`;
        
        // Add carrier information if we're a broker
        if (isBroker && rateConf.carrier) {
            rateConfHTML += `
                <div class="rate-confirmation-section">
                    <h3>Carrier Information</h3>
                    <p>Name: ${rateConf.carrier.name || 'N/A'}</p>
                    <p>MC#: ${rateConf.carrier.mc || 'N/A'}</p>
                    <p>DOT#: ${rateConf.carrier.dot || 'N/A'}</p>
                    <p>Contact: ${rateConf.carrier.contact || 'N/A'}</p>
                    <p>Phone: ${rateConf.carrier.phone || 'N/A'}</p>
                </div>`;
        }
        
        // Add load details
        rateConfHTML += `
                <div class="rate-confirmation-section">
                    <h3>Load Details</h3>
                    <table class="rate-confirmation-table">
                        <tr>
                            <th>Pick-up</th>
                            <th>Delivery</th>
                        </tr>
                        <tr>
                            <td>${rateConf.pickup?.location || 'N/A'}</td>
                            <td>${rateConf.delivery?.location || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td>${rateConf.pickup?.date || 'N/A'} ${rateConf.pickup?.time || ''}</td>
                            <td>${rateConf.delivery?.date || 'N/A'} ${rateConf.delivery?.time || ''}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="rate-confirmation-section">
                    <h3>Rate Information</h3>
                    <p>Total Rate: <span class="${this.isSuspiciousRate(rateConf.rate) ? 'suspicious-detail' : ''}">${rateConf.rate || 'N/A'}</span>
                       ${this.isSuspiciousRate(rateConf.rate) ? '<span class="warning-icon" title="This rate seems unusual">⚠️</span>' : ''}
                    </p>
                    <p>Payment Terms: <span class="${this.isSuspiciousPaymentTerms(rateConf.paymentTerms) ? 'suspicious-detail' : ''}">${rateConf.paymentTerms || 'N/A'}</span>
                       ${this.isSuspiciousPaymentTerms(rateConf.paymentTerms) ? '<span class="warning-icon" title="These payment terms are unusual">⚠️</span>' : ''}
                    </p>
                    ${rateConf.notes ? `<p>Notes: ${rateConf.notes}</p>` : ''}
                </div>
                
                <div class="action-instructions">
                    <p>What would you like to do with this rate confirmation?</p>
                </div>
                
                <div class="rate-confirmation-actions">
                    <button id="rate-accept" class="btn safe-btn" title="Accept this rate confirmation as legitimate">Accept</button>
                    <button id="rate-reject" class="btn danger-btn" title="Reject this rate confirmation as suspicious or fraudulent">Reject</button>
                    <button id="rate-verify" class="btn" title="Take time to verify details before deciding">Verify Details</button>
                    <button id="close-rate" class="btn" title="Close without making a decision">Close</button>
                </div>
            </div>
        `;
        
        // Set the HTML content
        computerInterface.innerHTML = rateConfHTML;
        
        // Add event listeners for buttons
        document.getElementById('close-rate').addEventListener('click', () => {
            computerInterface.classList.remove('active');
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing
            if (this.gameInstance && this.gameInstance.controls) {
                setTimeout(() => this.gameInstance.controls.lock(), 100);
            }
        });
        
        document.getElementById('rate-accept').addEventListener('click', () => {
            this.handleDecision('accept');
        });
        
        document.getElementById('rate-reject').addEventListener('click', () => {
            this.handleDecision('reject');
        });
        
        document.getElementById('rate-verify').addEventListener('click', () => {
            this.handleDecision('verify');
        });
    }
    
    // Helper methods for checking suspicious rate confirmation elements
    isSuspiciousMC(mc) {
        // Check if MC number matches known valid patterns or specific values
        if (!mc) return false;
        
        // For example, in our scenario we might know that Elite Logistics should have MC# 723456
        if (mc === '123456' && this.playerRole === 'carrier') {
            return true; // This is the example suspicious MC in our carrier scenario
        }
        
        return false;
    }
    
    isSuspiciousRate(rate) {
        // Check if rate is suspiciously high or low
        if (!rate) return false;
        
        // In our broker scenario, we know the rate was tampered from $2,500 to $3,500
        if (rate === '$3,500.00' && this.playerRole === 'broker') {
            return true;
        }
        
        return false;
    }
    
    isSuspiciousPaymentTerms(terms) {
        // Check if payment terms are unusually long or short
        if (!terms) return false;
        
        // Industry standard is typically 30-45 days
        if (terms.includes('90 days')) {
            return true; // Unusually long payment terms
        }
        
        return false;
    }
    
    showPartnerVerificationInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for partner verification interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Partner Verification</h2>
                        <button id="close-verification" class="btn">Close</button>
                    </div>
                    <div class="rate-confirmation-section">
                        <p>No partner data available</p>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-verification').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const profile = this.currentScenario.content;
        
        console.log('Showing partner verification interface with content:', profile);
        
        // Determine the type of profile we're showing
        let isCarrier = false;
        let customCarrierProfile = false;
        let customBrokerProfile = false;
        
        if (profile.hasOwnProperty('safetyMetrics')) {
            isCarrier = true;
        } else if (profile.hasOwnProperty('csaScores')) {
            isCarrier = true;
            customCarrierProfile = true;
        } else if (profile.hasOwnProperty('brokerName')) {
            customBrokerProfile = true;
        }
        
        let profileHTML = '';
        
        if (customCarrierProfile) {
            // Custom carrier profile format with csaScores
            profileHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Carrier Profile: ${profile.carrierName}</h2>
                        <div class="task-instruction">
                            <p>Analyze this carrier's safety scores and reviews. Identify potential double-brokering risks or safety concerns.</p>
                        </div>
                        <button id="close-verification" class="btn">Close</button>
                    </div>
                    
                    <div class="rate-confirmation-section">
                        <h3>Basic Information</h3>
                        <p>Years in Business: ${profile.yearsInBusiness || 'N/A'}</p>
                    </div>
                    
                    <div class="rate-confirmation-section">
                        <h3>CSA Safety Scores</h3>
                        <div class="insight-box">
                            <p>FMCSA intervention thresholds are 65% for most BASIC categories. Scores above this level indicate a higher risk.</p>
                        </div>
                        <table class="profile-table">
                            ${profile.csaScores.unsafeDriving ? `
                            <tr>
                                <td>Unsafe Driving:</td>
                                <td>${profile.csaScores.unsafeDriving}%</td>
                            </tr>
                            ` : ''}
                            ${profile.csaScores.crashIndicator ? `
                            <tr>
                                <td>Crash Indicator:</td>
                                <td>${profile.csaScores.crashIndicator}%</td>
                            </tr>
                            ` : ''}
                            ${profile.csaScores.hazmat ? `
                            <tr>
                                <td>Hazmat:</td>
                                <td>${profile.csaScores.hazmat}%</td>
                            </tr>
                            ` : ''}
                            ${profile.csaScores.inspection ? `
                            <tr>
                                <td>Inspection:</td>
                                <td>${profile.csaScores.inspection}%</td>
                            </tr>
                            ` : ''}
                            ${profile.csaScores.maintenance ? `
                            <tr>
                                <td>Maintenance:</td>
                                <td>${profile.csaScores.maintenance}%</td>
                            </tr>
                            ` : ''}
                        </table>
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
                    
                    <button id="close-verification" class="btn">Close</button>
                </div>
            `;
        } else if (customBrokerProfile) {
            // Custom broker profile format
            profileHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>Broker Profile: ${profile.brokerName}</h2>
                        <div class="task-instruction">
                            <p>Analyze this broker's credit score, payment history, and other details. Identify potential risks or concerns.</p>
                        </div>
                        <button id="close-verification" class="btn">Close</button>
                    </div>
                    
                    <div class="rate-confirmation-section">
                        <h3>Basic Information</h3>
                        <p>Years in Business: ${profile.yearsInBusiness || 'N/A'}</p>
                        <p>Credit Score: ${profile.creditScore || 'N/A'}</p>
                        <p>Days to Pay Average: ${profile.daysToPayAverage || 'N/A'}</p>
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
                    
                    <button id="close-verification" class="btn">Close</button>
                </div>
            `;
        } else {
            // Default profile format
            profileHTML = `
                <div class="rate-confirmation">
                    <div class="rate-confirmation-header">
                        <h2>${isCarrier ? 'Carrier' : 'Broker'} Profile</h2>
                        <div class="task-instruction">
                            <p>Analyze this ${isCarrier ? 'carrier' : 'broker'} for potential risks or concerns.</p>
                        </div>
                        <button id="close-verification" class="btn">Close</button>
                    </div>
                    
                    <div class="rate-confirmation-section">
                        <h3>Basic Information</h3>
                        <p>Name: ${profile.name || 'N/A'}</p>
                        <p>MC#: ${profile.mc || 'N/A'}</p>
                        <p>DOT#: ${profile.dot || 'N/A'}</p>
                        <p>Contact: ${profile.contact || 'N/A'}</p>
                        <p>Phone: ${profile.phone || 'N/A'}</p>
                        <p>Email: ${profile.email || 'N/A'}</p>
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
                    
                    <button id="close-verification" class="btn">Close</button>
                </div>
            `;
        }
        
        // Set the HTML content
        computerInterface.innerHTML = profileHTML;
        
        // Add close button functionality
        document.getElementById('close-verification').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing
            if (this.gameInstance && this.gameInstance.controls) {
                setTimeout(() => this.gameInstance.controls.lock(), 100);
            }
        });
    }
    
    handleDecision(action) {
        const computerInterface = document.getElementById('computer-interface');
        
        // Check if the action was correct
        const correct = action === this.currentScenario.correctAction;
        
        // Update score
        if (correct) {
            this.gameInstance.updateScore(10);
            
            // If this was a fraud scenario and the user correctly identified it
            if (action === 'report' || action === 'reject') {
                this.fraudDetected = true;
            }
        } else if (action === 'verify') {
            // Verifying details is always a safe action, even if not the final correct action
            this.gameInstance.updateScore(5);
        } else {
            this.gameInstance.updateScore(-5);
        }
        
        // Hide the interface
        computerInterface.classList.add('hidden');
        
        // Show feedback
        this.gameInstance.showFeedback(
            correct ? "Correct Decision!" : "Incorrect Decision",
            correct ? this.currentScenario.feedbackCorrect : this.currentScenario.feedbackIncorrect
        );
        
        // Load next scenario after a short delay
        setTimeout(() => {
            try {
                this.gameInstance.loadNextScenario();
                
                // Try to re-lock controls
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => {
                        try {
                            this.gameInstance.controls.lock();
                        } catch (e) {
                            console.warn('Error locking controls after decision:', e);
                        }
                    }, 100);
                }
            } catch (e) {
                console.error('Error in handleDecision:', e);
            }
        }, 3000);
    }
    
    generatePhishingCall(role) {
        if (role === 'carrier') {
            return {
                caller: {
                    name: 'John Smith',
                    company: 'Global Logistics Brokers',
                    number: '(555) 123-4567'
                },
                transcript: [
                    "Hello, this is John Smith from Global Logistics Brokers. I'm calling about your recent load delivery.",
                    "Our finance department needs to update your payment information in our system.",
                    "I'll need your bank account number and routing information to make sure you get paid correctly.",
                    "This is urgent as we have several payments pending that we need to release to you."
                ],
                redFlags: [
                    "Requesting sensitive banking information over the phone",
                    "Creating urgency to pressure quick decisions",
                    "No verification process to confirm caller's identity",
                    "Calling from a generic logistics company name"
                ]
            };
        } else {
            return {
                caller: {
                    name: 'Lisa Johnson',
                    company: 'Premier Factoring Services',
                    number: '(555) 987-6543'
                },
                transcript: [
                    "Hi, I'm Lisa Johnson from Premier Factoring Services. I'm calling about a carrier we both work with, FastLane Transport.",
                    "We're updating our records and need verification of their latest loads and payment details.",
                    "Can you provide me with the load numbers, amounts, and payment dates for any FastLane loads in the last 30 days?",
                    "I also need to confirm your payment portal login so we can streamline the factoring process."
                ],
                redFlags: [
                    "Requesting detailed load information without proper verification",
                    "Asking for payment portal login credentials",
                    "No prior relationship or communication established",
                    "Vague explanation of why the information is needed"
                ]
            };
        }
    }
    
    generateSuspiciousInvoice(role) {
        if (role === 'carrier') {
            return {
                invoiceNumber: 'INV-20230712-003',
                issuer: {
                    name: 'Premier Parts Supplier',
                    contact: 'accounting@premiersupply.net'
                },
                details: {
                    date: '2023-07-12',
                    amount: '$4,895.75',
                    description: 'Emergency truck repair and parts',
                    terms: 'Due immediately',
                    paymentInstructions: 'Payment to new account: Bank of America #2751836429'
                },
                redFlags: [
                    "Unusual payment destination different from previous invoices",
                    "Exceptionally high amount for typical parts/services",
                    "Urgent payment terms without typical net-30",
                    "Vague service description lacking itemization",
                    "Email domain doesn't precisely match company name"
                ]
            };
        } else {
            return {
                invoiceNumber: 'INV-5763',
                carrier: {
                    name: 'FastLane Transport LLC',
                    mc: '735492',
                    contact: 'billing@fastlaneltd.com'
                },
                details: {
                    loadId: 'SH29875',
                    date: '2023-07-18',
                    origin: 'Dallas, TX',
                    destination: 'Memphis, TN',
                    amount: '$3,750.00',
                    notes: 'Please remit payment to updated bank account: Wells Fargo #9865321457'
                },
                redFlags: [
                    "Payment requested to a different account than on file",
                    "Invoice amount higher than rate confirmation ($2,950)",
                    "Origin/destination details don't match load records",
                    "Email domain differs from carrier's official domain",
                    "Invoice format inconsistent with carrier's previous invoices"
                ]
            };
        }
    }
    
    showPhishingCallInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for phone call interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="phone-call-container">
                    <div class="call-header">
                        <h2>Incoming Call</h2>
                        <button id="close-phone" class="btn">Close</button>
                    </div>
                    <div class="call-content">
                        <p>Call information unavailable</p>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-phone').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const callData = this.currentScenario.content;
        let callContent = '';
        
        // Check if callData has a callTranscript array (new format) or transcript array (old format)
        if (callData.callTranscript) {
            // New format with structured dialog
            callContent = `
                <div class="caller-info">
                    <h3>${callData.brokerName || callData.carrierName}</h3>
                    <p>${callData.loadDetails ? 'Load: ' + callData.loadDetails.origin + ' to ' + callData.loadDetails.destination : ''}</p>
                    ${callData.creditScore ? `<p>Credit Score: ${callData.creditScore}</p>` : ''}
                    ${callData.daysToPayAverage ? `<p>Days to Pay: ${callData.daysToPayAverage}</p>` : ''}
                    ${callData.agreedRate ? `<p>Agreed Rate: ${callData.agreedRate}</p>` : ''}
                    ${callData.claimedRate ? `<p>Claimed Rate: ${callData.claimedRate}</p>` : ''}
                    ${callData.registeredMC ? `<p>Registered MC#: ${callData.registeredMC}</p>` : ''}
                    ${callData.claimedMC ? `<p>Claimed MC#: ${callData.claimedMC}</p>` : ''}
                </div>
                <div class="call-transcript">
                    <h3>Call Transcript:</h3>
                    <div class="conversation">
                        ${callData.callTranscript.map(line => 
                            `<div class="conversation-line ${line.speaker === 'You' ? 'user-line' : 'caller-line'}">
                                <strong>${line.speaker}:</strong> ${line.text}
                             </div>`
                        ).join('')}
                    </div>
                </div>
            `;
        } else if (callData.transcript) {
            // Old format with simple transcript array
            callContent = `
                <div class="caller-info">
                    <h3>${callData.caller.name}</h3>
                    <p>${callData.caller.company}</p>
                    <p>${callData.caller.number}</p>
                </div>
                <div class="call-transcript">
                    <h3>Call Transcript:</h3>
                    ${callData.transcript.map(line => `<p class="transcript-line">${line}</p>`).join('')}
                </div>
            `;
        } else {
            // Fallback for unexpected format
            callContent = `
                <div class="caller-info">
                    <h3>Call Details</h3>
                    <p>Unable to display call transcript in expected format</p>
                </div>
            `;
        }
        
        computerInterface.innerHTML = `
            <div class="phone-call-container">
                <div class="call-header">
                    <h2>Phone Call</h2>
                    <div class="task-instruction">
                        <p>Analyze this call for potential fraud indicators. Check for inconsistencies, unusual requests, or pressure tactics.</p>
                    </div>
                    <button id="close-phone" class="btn">Close</button>
                </div>
                <div class="call-content">
                    ${callContent}
                    <div class="call-actions">
                        <button id="call-report" class="btn danger-btn">Report as Suspicious</button>
                        <button id="call-accept" class="btn safe-btn">Accept as Legitimate</button>
                        <button id="call-reject" class="btn warning-btn">Reject/End Call</button>
                        <button id="call-verify" class="btn">Request More Verification</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for call interface
        document.getElementById('close-phone').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing
            if (this.gameInstance && this.gameInstance.controls) {
                setTimeout(() => this.gameInstance.controls.lock(), 100);
            }
        });
        
        document.getElementById('call-report').addEventListener('click', () => {
            this.handleDecision('report');
        });
        
        document.getElementById('call-accept').addEventListener('click', () => {
            this.handleDecision('accept');
        });
        
        document.getElementById('call-reject').addEventListener('click', () => {
            this.handleDecision('reject');
        });
        
        document.getElementById('call-verify').addEventListener('click', () => {
            this.handleDecision('verify');
        });
    }
    
    showInvoiceInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for invoice interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="invoice-container">
                    <div class="invoice-header">
                        <h2>Invoice</h2>
                        <button id="close-invoice" class="btn">Close</button>
                    </div>
                    <div class="invoice-content">
                        <p>Invoice information unavailable</p>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-invoice').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const invoice = this.currentScenario.content;
        
        if (this.playerRole === 'carrier') {
            computerInterface.innerHTML = `
                <div class="invoice-container">
                    <div class="invoice-header">
                        <h2>Invoice #${invoice.invoiceNumber}</h2>
                        <button id="close-invoice" class="btn">Close</button>
                    </div>
                    <div class="invoice-content">
                        <div class="invoice-from">
                            <h3>${invoice.issuer.name}</h3>
                            <p>Contact: ${invoice.issuer.contact}</p>
                        </div>
                        <div class="invoice-details">
                            <div class="detail-row">
                                <span>Date:</span>
                                <span>${invoice.details.date}</span>
                            </div>
                            <div class="detail-row">
                                <span>Amount:</span>
                                <span>${invoice.details.amount}</span>
                            </div>
                            <div class="detail-row">
                                <span>Description:</span>
                                <span>${invoice.details.description}</span>
                            </div>
                            <div class="detail-row">
                                <span>Terms:</span>
                                <span>${invoice.details.terms}</span>
                            </div>
                            <div class="detail-row highlight">
                                <span>Payment Instructions:</span>
                                <span>${invoice.details.paymentInstructions}</span>
                            </div>
                        </div>
                        <div class="invoice-actions">
                            <button id="invoice-pay" class="btn">Pay Now</button>
                            <button id="invoice-verify" class="btn">Verify First</button>
                            <button id="invoice-reject" class="btn">Reject</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            computerInterface.innerHTML = `
                <div class="invoice-container">
                    <div class="invoice-header">
                        <h2>Invoice #${invoice.invoiceNumber}</h2>
                        <button id="close-invoice" class="btn">Close</button>
                    </div>
                    <div class="invoice-content">
                        <div class="invoice-from">
                            <h3>${invoice.carrier.name} (MC# ${invoice.carrier.mc})</h3>
                            <p>Contact: ${invoice.carrier.contact}</p>
                        </div>
                        <div class="invoice-details">
                            <div class="detail-row">
                                <span>Load ID:</span>
                                <span>${invoice.details.loadId}</span>
                            </div>
                            <div class="detail-row">
                                <span>Date:</span>
                                <span>${invoice.details.date}</span>
                            </div>
                            <div class="detail-row">
                                <span>Origin:</span>
                                <span>${invoice.details.origin}</span>
                            </div>
                            <div class="detail-row">
                                <span>Destination:</span>
                                <span>${invoice.details.destination}</span>
                            </div>
                            <div class="detail-row">
                                <span>Amount:</span>
                                <span>${invoice.details.amount}</span>
                            </div>
                            <div class="detail-row highlight">
                                <span>Notes:</span>
                                <span>${invoice.details.notes}</span>
                            </div>
                        </div>
                        <div class="invoice-actions">
                            <button id="invoice-pay" class="btn">Process Payment</button>
                            <button id="invoice-verify" class="btn">Verify First</button>
                            <button id="invoice-reject" class="btn">Reject</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Add event listeners for invoice interface
        document.getElementById('close-invoice').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing
            if (this.gameInstance && this.gameInstance.controls) {
                setTimeout(() => this.gameInstance.controls.lock(), 100);
            }
        });
        
        document.getElementById('invoice-pay').addEventListener('click', () => {
            this.handleDecision('accept');
        });
        
        document.getElementById('invoice-verify').addEventListener('click', () => {
            this.handleDecision('verify');
        });
        
        document.getElementById('invoice-reject').addEventListener('click', () => {
            this.handleDecision('reject');
        });
    }
    
    // Add new method to generate alternative phishing emails
    generateAlternativePhishingEmail(role) {
        if (role === 'carrier') {
            return {
                from: 'support@secure-loadboard.co',
                subject: 'Action Required: Update Payment Details',
                date: 'Today, 2:18 PM',
                body: `
                    <p>Dear Valued Carrier Partner,</p>
                    <p>Our payment processing system has been updated to enhance security and payment speed.</p>
                    <p><strong>To continue receiving timely payments for your loads, you must update your payment information immediately.</strong></p>
                    <p>Please click the link below to update your payment details:</p>
                    <button class="btn">Update Payment Details</button>
                    <p>If you have any questions, please do not respond to this email but call our support line.</p>
                    <p>Regards,</p>
                    <p>Finance Department</p>
                `,
                attachments: ['PaymentUpdate_Form.pdf.exe']
            };
        } else {
            return {
                from: 'admin@loadboard-inc.net',
                subject: 'Security Alert: Login Detected from New Location',
                date: 'Today, 9:37 AM',
                body: `
                    <p>Dear Broker,</p>
                    <p>We have detected a login attempt to your account from an unrecognized location.</p>
                    <p><strong>For your security, we have temporarily limited access to your account.</strong></p>
                    <p>To verify your identity and restore full access, please confirm your login credentials at the secure link below:</p>
                    <button class="btn">Verify Identity</button>
                    <p>If you did not attempt to log in, please change your password immediately.</p>
                    <p>LoadBoard Security Team</p>
                `,
                attachments: []
            };
        }
    }
    
    // Add method to generate legitimate emails for comparison
    generateLegitimateEmail(role) {
        if (role === 'carrier') {
            return {
                from: 'payments@legitbroker.com',
                subject: 'Payment Confirmation for Load #LD58729',
                date: 'Today, 11:05 AM',
                body: `
                    <p>Dear Carrier Partner,</p>
                    <p>This is a confirmation that payment for Load #LD58729 (Chicago to Detroit) has been processed.</p>
                    <p>Amount: $2,450.00</p>
                    <p>Payment Method: ACH to account ending in 4832</p>
                    <p>You should see the funds in your account within 2-3 business days.</p>
                    <p>Thank you for your service.</p>
                    <p>Regards,</p>
                    <p>Jennifer Thomas<br>Accounts Payable<br>Legitimate Broker Inc.</p>
                `,
                attachments: ['Payment_Receipt_LD58729.pdf']
            };
        } else {
            return {
                from: 'dispatch@reliablecarriers.com',
                subject: 'Load Delivery Confirmation - #SH37291',
                date: 'Today, 3:45 PM',
                body: `
                    <p>Hello,</p>
                    <p>This is to confirm that Load #SH37291 has been successfully delivered.</p>
                    <p>The BOL and POD are attached for your records.</p>
                    <p>Please process payment according to our agreed terms (Net-30).</p>
                    <p>Thank you for your business.</p>
                    <p>Best regards,</p>
                    <p>Mike Johnson<br>Dispatch Manager<br>Reliable Carriers Inc.</p>
                `,
                attachments: ['BOL_SH37291.pdf', 'POD_SH37291.pdf']
            };
        }
    }
    
    // Add method to generate legitimate rate confirmations
    generateLegitimateRateConfirmation(role) {
        if (role === 'carrier') {
            return {
                loadId: 'RC98765432',
                broker: {
                    name: 'Premier Logistics',
                    mc: '723456', // Correct MC number
                    contact: 'Michael Brown',
                    email: 'mbrown@premierlogistics.com', // Domain matches company name
                    phone: '(555) 123-4567'
                },
                pickup: {
                    location: 'Denver, CO',
                    date: '05/20/2023',
                    time: '10:00'
                },
                delivery: {
                    location: 'Salt Lake City, UT',
                    date: '05/21/2023',
                    time: '15:00'
                },
                rate: '$1,950.00',
                paymentTerms: 'Net 30', // Standard payment terms
                notes: 'Temperature controlled, maintain at 45F'
            };
        } else {
            return {
                loadId: 'RC76543210',
                carrier: {
                    name: 'Reliable Transport LLC',
                    mc: '876543',
                    dot: '2345678',
                    contact: 'David Smith',
                    phone: '(555) 987-6543'
                },
                pickup: {
                    location: 'Memphis, TN',
                    date: '05/25/2023',
                    time: '09:00'
                },
                delivery: {
                    location: 'Nashville, TN',
                    date: '05/25/2023',
                    time: '15:00'
                },
                rate: '$850.00', // Original, unaltered rate
                paymentTerms: 'Net 15',
                notes: 'No-touch load, drop and hook'
            };
        }
    }
    
    // Add method to generate a safe carrier profile
    generateSafeCarrierProfile() {
        return {
            name: 'Reliable Trucking Solutions',
            mc: '654321',
            dot: '7654321',
            authority: 'Active since 2015',
            address: '789 Transport Way, Dallas, TX 75201',
            safetyMetrics: {
                unsafeDriving: '32%', // Well below 65% threshold (good)
                hoursOfService: '28%',
                driverFitness: '15%',
                vehicleMaintenance: '24%',
                crashIndicator: '18%' // Well below 65% threshold (good)
            },
            fleet: {
                size: 25,
                type: 'Dry Van, Flatbed, Refrigerated'
            },
            insurance: {
                autoLiability: '$1,000,000',
                cargo: '$250,000',
                expiration: '2024-06-30'
            }
        };
    }
    
    // Add method to generate a legitimate broker profile
    generateLegitBrokerProfile() {
        return {
            name: 'Quality Freight Services',
            mc: '345678',
            address: '567 Logistics Center, Chicago, IL 60607',
            established: '2012',
            creditScore: {
                ansonia: '91', // Good score (out of 100)
                averageDaysToPay: '21' // Good payment timeline
            },
            references: [
                { name: 'ABC Transport', contact: '(555) 123-4567' },
                { name: 'XYZ Carriers', contact: '(555) 987-6543' }
            ],
            insurance: {
                contingentCargo: '$250,000',
                bondAmount: '$75,000'
            }
        };
    }
    
    // Add a new method to show a mobile email interface
    showMobileEmailInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for mobile email interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="phone-container">
                    <div class="phone-header">
                        <h2>Email on Phone</h2>
                        <button id="close-phone" class="btn">Close</button>
                    </div>
                    <div class="phone-content">
                        <p>No email content available</p>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-phone').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const email = this.currentScenario.content;
        
        console.log('Showing mobile email interface with content:', email);
        
        computerInterface.innerHTML = `
            <div class="phone-container">
                <div class="phone-header">
                    <h2>Email on Phone</h2>
                    <button id="close-phone" class="btn">Close</button>
                </div>
                <div class="phone-content">
                    <h3>From: ${email.from || 'Unknown Sender'}</h3>
                    <h3>Subject: ${email.subject || 'No Subject'}</h3>
                    <div class="email-body">
                        ${email.body || 'No content available'}
                    </div>
                    ${email.attachments && email.attachments.length > 0 ? `<div class="email-attachments">
                        <h4>Attachments:</h4>
                        <ul>
                            ${email.attachments.map(attachment => `<li>${attachment}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                    <div class="email-actions">
                        <button id="email-report" class="btn">Report as Phishing</button>
                        <button id="email-accept" class="btn">Accept as Legitimate</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('close-phone').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing the interface
            if (this.gameInstance && this.gameInstance.controls) {
                setTimeout(() => this.gameInstance.controls.lock(), 100);
            }
        });
        
        document.getElementById('email-report').addEventListener('click', () => {
            this.handleDecision('report');
        });
        
        document.getElementById('email-accept').addEventListener('click', () => {
            this.handleDecision('accept');
        });
    }

    // Add a method to show mobile rate confirmation
    showMobileRateConfirmationInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for mobile rate confirmation interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="phone-container">
                    <div class="phone-header">
                        <h2>Rate Confirmation</h2>
                        <button id="close-phone" class="btn">Close</button>
                    </div>
                    <div class="phone-content">
                        <p>No rate confirmation available</p>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-phone').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const rateConf = this.currentScenario.content;
        
        console.log('Showing mobile rate confirmation interface with content:', rateConf);
        
        computerInterface.innerHTML = `
            <div class="phone-container">
                <div class="phone-header">
                    <h2>Rate Confirmation #${rateConf.loadId || 'Unknown'}</h2>
                    <button id="close-phone" class="btn">Close</button>
                </div>
                <div class="phone-content">
                    <h3>Broker: ${rateConf.broker?.name || 'N/A'}</h3>
                    <p>MC#: ${rateConf.broker?.mc || 'N/A'}</p>
                    <h3>Load Details:</h3>
                    <p>Pickup: ${rateConf.pickup?.location || 'N/A'} (${rateConf.pickup?.date || 'N/A'})</p>
                    <p>Delivery: ${rateConf.delivery?.location || 'N/A'} (${rateConf.delivery?.date || 'N/A'})</p>
                    <p>Rate: ${rateConf.rate || 'N/A'}</p>
                    <p>Terms: ${rateConf.paymentTerms || 'N/A'}</p>
                    <div class="email-actions">
                        <button id="rate-accept" class="btn">Accept</button>
                        <button id="rate-reject" class="btn">Reject</button>
                        <button id="rate-verify" class="btn">Verify</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('close-phone').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing the interface
            if (this.gameInstance && this.gameInstance.controls) {
                setTimeout(() => this.gameInstance.controls.lock(), 100);
            }
        });
        
        document.getElementById('rate-accept').addEventListener('click', () => {
            this.handleDecision('accept');
        });
        
        document.getElementById('rate-reject').addEventListener('click', () => {
            this.handleDecision('reject');
        });
        
        document.getElementById('rate-verify').addEventListener('click', () => {
            this.handleDecision('verify');
        });
    }

    // Add a method to show mobile invoice interface
    showMobileInvoiceInterface() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        
        // Check if content exists
        if (!this.currentScenario || !this.currentScenario.content) {
            console.error('No scenario content available for mobile invoice interface');
            
            // Show a fallback interface
            computerInterface.innerHTML = `
                <div class="phone-container">
                    <div class="phone-header">
                        <h2>Invoice</h2>
                        <button id="close-phone" class="btn">Close</button>
                    </div>
                    <div class="phone-content">
                        <p>No invoice available</p>
                    </div>
                </div>
            `;
            
            // Add close button functionality
            document.getElementById('close-phone').addEventListener('click', () => {
                computerInterface.classList.add('hidden');
                
                // Re-lock controls when closing
                if (this.gameInstance && this.gameInstance.controls) {
                    setTimeout(() => this.gameInstance.controls.lock(), 100);
                }
            });
            
            return;
        }
        
        const invoice = this.currentScenario.content;
        
        console.log('Showing mobile invoice interface with content:', invoice);
        
        computerInterface.innerHTML = `
            <div class="phone-container">
                <div class="phone-header">
                    <h2>Invoice #${invoice.invoiceNumber || 'Unknown'}</h2>
                    <button id="close-phone" class="btn">Close</button>
                </div>
                <div class="phone-content">
                    <h3>From: ${invoice.issuer?.name || invoice.carrier?.name || 'N/A'}</h3>
                    <p>Date: ${invoice.details?.date || 'N/A'}</p>
                    <p>Amount: ${invoice.details?.amount || 'N/A'}</p>
                    <p>Payment Instructions: ${invoice.details?.paymentInstructions || 'N/A'}</p>
                    <div class="email-actions">
                        <button id="invoice-approve" class="btn">Approve</button>
                        <button id="invoice-reject" class="btn">Reject</button>
                        <button id="invoice-verify" class="btn">Verify</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('close-phone').addEventListener('click', () => {
            computerInterface.classList.add('hidden');
            
            // Re-lock controls when closing the interface
            if (this.gameInstance && this.gameInstance.controls) {
                setTimeout(() => this.gameInstance.controls.lock(), 100);
            }
        });
        
        document.getElementById('invoice-approve').addEventListener('click', () => {
            this.handleDecision('accept');
        });
        
        document.getElementById('invoice-reject').addEventListener('click', () => {
            this.handleDecision('reject');
        });
        
        document.getElementById('invoice-verify').addEventListener('click', () => {
            this.handleDecision('verify');
        });
    }
    
    showIndustryStatistics() {
        const computerInterface = document.getElementById('computer-interface');
        computerInterface.classList.remove('hidden');
        computerInterface.innerHTML = `
            <div class="stats-container">
                <div class="stats-section">
                    <h3>Freight Fraud Statistics</h3>
                    <p>Transportation companies face significant fraud risks:</p>
                    <ul>
                        <li>Double-brokering scams (42% of fraud cases)</li>
                        <li>Identity theft (25% of cases)</li>
                        <li>Phishing attacks (17% of cases)</li>
                        <li>Payment fraud (16% of cases)</li>
                    </ul>
                </div>
                <div class="stats-section">
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
}