import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Heart, User } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Mock blog posts data (same as Blog.jsx)
const BLOG_POSTS = [
  {
    id: 1,
    title: 'How Technology is Transforming NGO Operations in India',
    slug: 'technology-transforming-ngo-operations',
    excerpt: 'Discover how digital platforms are helping NGOs reach more beneficiaries, manage volunteers efficiently, and maintain transparency with donors.',
    thumbnail: 'bg-gradient-to-br from-teal to-teal-dark',
    category: 'Technology',
    date: '2026-01-15',
    readTime: '5 min read',
    author: 'Priya Sharma',
    content: `
      <p>The landscape of non-governmental organizations (NGOs) in India is undergoing a remarkable transformation, driven by the adoption of innovative technologies. From rural villages to urban centers, digital platforms are revolutionizing how NGOs operate, connect with stakeholders, and deliver impact.</p>

      <h2>The Digital Revolution in Social Sector</h2>
      <p>Gone are the days when NGOs relied solely on paper-based records and manual processes. Today's NGOs are leveraging cloud-based platforms, mobile applications, and data analytics to streamline their operations and maximize their impact.</p>

      <h3>Key Areas of Transformation</h3>
      <ul>
        <li><strong>Volunteer Management:</strong> Digital platforms now enable NGOs to recruit, onboard, and manage volunteers efficiently. Real-time tracking of volunteer hours, skills matching, and automated certificate generation have become standard features.</li>
        <li><strong>Donation Tracking:</strong> Blockchain technology and digital payment systems ensure complete transparency in fund utilization, building trust with donors.</li>
        <li><strong>Beneficiary Management:</strong> CRM systems help NGOs maintain detailed records of beneficiaries, track program outcomes, and measure impact effectively.</li>
        <li><strong>Communication:</strong> WhatsApp groups, email campaigns, and social media have made it easier to keep stakeholders informed and engaged.</li>
      </ul>

      <h2>Success Stories</h2>
      <p>Several Indian NGOs have successfully implemented technology solutions. For instance, Smile Foundation uses a comprehensive digital platform to manage over 10,000 volunteers across 25 states, while Teach India leverages mobile apps to connect tutors with students in real-time.</p>

      <h2>Challenges and Solutions</h2>
      <p>While technology adoption offers immense benefits, NGOs face challenges such as limited digital literacy, infrastructure constraints, and budget limitations. However, platforms like ServeSphere are addressing these challenges by offering user-friendly, affordable solutions specifically designed for the Indian social sector.</p>

      <h2>The Road Ahead</h2>
      <p>As internet penetration increases and technology becomes more accessible, we can expect even greater innovation in the NGO sector. Artificial intelligence, machine learning, and IoT devices will further enhance the ability of NGOs to create measurable, sustainable impact.</p>

      <p>The future of social work in India is digital, transparent, and incredibly promising.</p>
    `,
  },
  {
    id: 2,
    title: 'The Impact of Volunteer Work on Personal Growth',
    slug: 'volunteer-work-personal-growth',
    excerpt: 'Learn how volunteering not only helps communities but also develops crucial life skills, builds networks, and enhances career prospects.',
    thumbnail: 'bg-gradient-to-br from-amber to-amber-dark',
    category: 'Volunteering',
    date: '2026-01-12',
    readTime: '4 min read',
    author: 'Arjun Kulkarni',
    content: `
      <p>Volunteering is often seen as a selfless act of giving back to society. However, what many people don't realize is that volunteering offers profound benefits for personal growth and development.</p>

      <h2>Skills Development</h2>
      <p>Through volunteer work, individuals develop a wide range of transferable skills that are valuable in both personal and professional contexts.</p>

      <h3>Key Skills Gained Through Volunteering</h3>
      <ul>
        <li><strong>Leadership:</strong> Managing teams, coordinating events, and taking initiative in community projects.</li>
        <li><strong>Communication:</strong> Interacting with diverse groups, public speaking, and cross-cultural communication.</li>
        <li><strong>Problem-Solving:</strong> Addressing real-world challenges with limited resources.</li>
        <li><strong>Empathy:</strong> Understanding different perspectives and developing emotional intelligence.</li>
      </ul>

      <h2>Career Benefits</h2>
      <p>Volunteer experience is increasingly valued by employers. It demonstrates initiative, commitment, and a well-rounded personality. Many professionals have found that their volunteer work opened doors to new career opportunities.</p>

      <h2>Mental Health and Well-being</h2>
      <p>Research shows that volunteering has positive effects on mental health. The sense of purpose, social connections, and feeling of making a difference contribute to overall well-being and life satisfaction.</p>

      <h2>Building Networks</h2>
      <p>Volunteering connects you with like-minded individuals, professionals from various fields, and community leaders. These connections often lead to lasting friendships and professional relationships.</p>

      <h2>Getting Started</h2>
      <p>If you're interested in experiencing these benefits, start by identifying causes you're passionate about. Platforms like ServeSphere make it easy to find volunteer opportunities that match your skills and interests.</p>
    `,
  },
  {
    id: 3,
    title: 'Transparency in Donations: Why It Matters',
    slug: 'transparency-in-donations',
    excerpt: 'Understanding the importance of donation tracking and how blockchain technology is revolutionizing trust in charitable giving.',
    thumbnail: 'bg-gradient-to-br from-coral to-red-500',
    category: 'Donations',
    date: '2026-01-10',
    readTime: '6 min read',
    author: 'Sunita Mehta',
    content: `
      <p>In an era where trust in institutions is declining, transparency in charitable donations has become more critical than ever. Donors want to know exactly how their contributions are being used and what impact they're creating.</p>

      <h2>The Trust Gap</h2>
      <p>Studies show that lack of transparency is one of the primary reasons people hesitate to donate. Without clear visibility into fund utilization, donors remain skeptical about whether their money is truly making a difference.</p>

      <h2>What Transparency Means</h2>
      <p>True transparency in donations involves:</p>
      <ul>
        <li>Clear breakdown of how funds are allocated</li>
        <li>Regular updates on project progress</li>
        <li>Photographic and documentary evidence of work done</li>
        <li>Financial statements and audit reports</li>
        <li>Impact metrics and outcome measurements</li>
      </ul>

      <h2>Technology as an Enabler</h2>
      <p>Modern technology, particularly blockchain, is revolutionizing donation transparency. Blockchain creates an immutable record of every transaction, making it impossible to manipulate or hide fund utilization.</p>

      <h3>How It Works</h3>
      <p>When you donate through a blockchain-enabled platform, every rupee is tracked from your account to the final beneficiary. You can see exactly when funds were received, how they were spent, and what outcomes were achieved.</p>

      <h2>The ServeSphere Approach</h2>
      <p>At ServeSphere, we've built transparency into every aspect of our platform. Donors receive real-time updates, NGOs upload proof of work, and our verification team ensures authenticity. This three-way accountability creates a trust ecosystem that benefits everyone.</p>

      <h2>Impact on Giving</h2>
      <p>Organizations that embrace transparency see significant increases in donor retention and contribution amounts. When donors can see their impact, they're more likely to give again and recommend the organization to others.</p>

      <h2>The Future</h2>
      <p>As transparency becomes the norm rather than the exception, we'll see a transformation in charitable giving. More people will donate, NGOs will become more accountable, and ultimately, more lives will be changed.</p>
    `,
  },
  {
    id: 4,
    title: 'Building Trust: How NGOs Can Improve Their Credibility',
    slug: 'building-trust-ngo-credibility',
    excerpt: 'Practical strategies for NGOs to build and maintain trust with volunteers, donors, and the communities they serve.',
    thumbnail: 'bg-gradient-to-br from-teal-dark to-ink',
    category: 'NGO Management',
    date: '2026-01-08',
    readTime: '7 min read',
    author: 'Rahul Verma',
    content: `
      <p>Trust is the foundation of any successful NGO. Without it, attracting volunteers, securing donations, and creating lasting impact becomes nearly impossible. Here's how NGOs can build and maintain credibility.</p>

      <h2>1. Registration and Legal Compliance</h2>
      <p>Ensure your NGO is properly registered under the appropriate act (Trust Act, Society Registration Act, or Companies Act). Maintain all legal documents and renew registrations on time.</p>

      <h2>2. Financial Transparency</h2>
      <p>Publish annual reports, financial statements, and audit reports. Make these documents easily accessible on your website. Show exactly how funds are utilized with detailed breakdowns.</p>

      <h2>3. Regular Communication</h2>
      <p>Keep stakeholders informed through newsletters, social media updates, and annual reports. Share both successes and challenges honestly.</p>

      <h2>4. Impact Measurement</h2>
      <p>Develop clear metrics to measure your impact. Use data to demonstrate outcomes, not just outputs. For example, don't just report "distributed 100 books" but "improved reading levels of 100 children by 2 grades."</p>

      <h2>5. Volunteer and Beneficiary Testimonials</h2>
      <p>Real stories from real people build credibility. Collect and share testimonials, case studies, and success stories regularly.</p>

      <h2>6. Professional Website and Social Media Presence</h2>
      <p>Your online presence is often the first impression. Invest in a professional website that clearly communicates your mission, work, and impact.</p>

      <h2>7. Third-Party Verification</h2>
      <p>Get your NGO verified by platforms like ServeSphere, GuideStar India, or Credibility Alliance. These certifications signal trustworthiness to potential supporters.</p>

      <h2>8. Governance Structure</h2>
      <p>Have a diverse, active board of directors. Avoid conflicts of interest and ensure proper oversight of operations.</p>

      <h2>9. Respond to Queries Promptly</h2>
      <p>Whether it's a donor question or a volunteer inquiry, respond quickly and professionally. Good communication builds trust.</p>

      <h2>10. Continuous Improvement</h2>
      <p>Regularly seek feedback from stakeholders and act on it. Show that you're committed to learning and improving.</p>

      <p>Building trust takes time, but it's worth the effort. A trusted NGO attracts better volunteers, more donations, and creates greater impact.</p>
    `,
  },
  {
    id: 5,
    title: 'Success Story: How One Volunteer Changed 100 Lives',
    slug: 'volunteer-success-story',
    excerpt: 'An inspiring journey of a volunteer who started with teaching one child and ended up creating an education movement in rural Maharashtra.',
    thumbnail: 'bg-gradient-to-br from-amber-dark to-orange-600',
    category: 'Success Stories',
    date: '2026-01-05',
    readTime: '8 min read',
    author: 'Meera Patel',
    content: `
      <p>This is the story of Rajesh Kumar, a software engineer from Pune who decided to spend his weekends teaching underprivileged children. What started as a small initiative grew into a movement that has transformed over 100 lives.</p>

      <h2>The Beginning</h2>
      <p>In 2023, Rajesh was scrolling through ServeSphere when he came across a request from a small NGO in a village near Pune. They needed someone to teach basic computer skills to children. Despite having no teaching experience, Rajesh decided to give it a try.</p>

      <h2>The First Day</h2>
      <p>"I was nervous," Rajesh recalls. "I had prepared a detailed lesson plan, but when I saw those eager faces, I realized they needed more than just computer skills. They needed someone who believed in them."</p>

      <h2>Building Momentum</h2>
      <p>Rajesh started with just 5 students. He taught them basic computer operations, typing, and internet usage. But he also mentored them, helped with homework, and encouraged them to dream big.</p>

      <p>Word spread quickly. Within three months, his class had grown to 20 students. Parents started approaching him, asking if he could teach their children too.</p>

      <h2>The Turning Point</h2>
      <p>One of his students, 14-year-old Priya, showed exceptional aptitude for coding. Rajesh started teaching her programming after regular classes. Within a year, Priya had built her first mobile app – a simple calculator that helped her father, a vegetable vendor, manage his daily accounts.</p>

      <p>This success inspired Rajesh to think bigger. He reached out to his colleagues and friends, recruiting more volunteers. Together, they expanded the program to cover multiple subjects and life skills.</p>

      <h2>The Impact</h2>
      <p>Three years later, the program has:</p>
      <ul>
        <li>Taught over 100 children</li>
        <li>Helped 15 students secure scholarships for higher education</li>
        <li>Created a library with 500+ books</li>
        <li>Established a computer lab with 10 computers</li>
        <li>Inspired 25 other professionals to become regular volunteers</li>
      </ul>

      <h2>Priya's Journey</h2>
      <p>Priya, the student who built the calculator app, is now in college studying computer science on a full scholarship. She returns to the village every vacation to teach the next generation of students.</p>

      <h2>Lessons Learned</h2>
      <p>Rajesh shares his key learnings:</p>
      <ul>
        <li>"Start small, but start now. You don't need to change the world on day one."</li>
        <li>"Consistency matters more than intensity. Showing up every week builds trust."</li>
        <li>"Empower, don't just teach. Help people discover their own potential."</li>
        <li>"Collaborate. You can't do everything alone, and you shouldn't try to."</li>
      </ul>

      <h2>Your Turn</h2>
      <p>Rajesh's story shows that one person really can make a difference. You don't need special qualifications or unlimited time. You just need to care and take that first step.</p>

      <p>What will your impact story be?</p>
    `,
  },
  {
    id: 6,
    title: 'Understanding the UN Sustainable Development Goals',
    slug: 'understanding-sdgs',
    excerpt: 'A comprehensive guide to the 17 SDGs and how your volunteer work or donations contribute to global development targets.',
    thumbnail: 'bg-gradient-to-br from-teal to-blue-600',
    category: 'Education',
    date: '2026-01-03',
    readTime: '10 min read',
    author: 'Dr. Anjali Singh',
    content: `
      <p>The United Nations Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet, and ensure prosperity for all by 2030. Understanding these goals helps you align your volunteer work or donations with global development priorities.</p>

      <h2>What Are the SDGs?</h2>
      <p>Adopted by all UN member states in 2015, the 17 SDGs provide a shared blueprint for peace and prosperity. They recognize that ending poverty must go hand-in-hand with strategies that build economic growth and address social needs while tackling climate change.</p>

      <h2>The 17 Goals</h2>
      
      <h3>1. No Poverty</h3>
      <p>End poverty in all its forms everywhere. This includes ensuring equal rights to economic resources and access to basic services.</p>

      <h3>2. Zero Hunger</h3>
      <p>End hunger, achieve food security, improve nutrition, and promote sustainable agriculture.</p>

      <h3>3. Good Health and Well-being</h3>
      <p>Ensure healthy lives and promote well-being for all at all ages, including reducing maternal mortality and ending epidemics.</p>

      <h3>4. Quality Education</h3>
      <p>Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.</p>

      <h3>5. Gender Equality</h3>
      <p>Achieve gender equality and empower all women and girls, ending discrimination and violence.</p>

      <h3>6. Clean Water and Sanitation</h3>
      <p>Ensure availability and sustainable management of water and sanitation for all.</p>

      <h3>7. Affordable and Clean Energy</h3>
      <p>Ensure access to affordable, reliable, sustainable, and modern energy for all.</p>

      <h3>8. Decent Work and Economic Growth</h3>
      <p>Promote sustained, inclusive, and sustainable economic growth, full employment, and decent work.</p>

      <h3>9. Industry, Innovation, and Infrastructure</h3>
      <p>Build resilient infrastructure, promote inclusive industrialization, and foster innovation.</p>

      <h3>10. Reduced Inequalities</h3>
      <p>Reduce inequality within and among countries.</p>

      <h3>11. Sustainable Cities and Communities</h3>
      <p>Make cities and human settlements inclusive, safe, resilient, and sustainable.</p>

      <h3>12. Responsible Consumption and Production</h3>
      <p>Ensure sustainable consumption and production patterns.</p>

      <h3>13. Climate Action</h3>
      <p>Take urgent action to combat climate change and its impacts.</p>

      <h3>14. Life Below Water</h3>
      <p>Conserve and sustainably use oceans, seas, and marine resources.</p>

      <h3>15. Life on Land</h3>
      <p>Protect, restore, and promote sustainable use of terrestrial ecosystems.</p>

      <h3>16. Peace, Justice, and Strong Institutions</h3>
      <p>Promote peaceful and inclusive societies, provide access to justice, and build effective institutions.</p>

      <h3>17. Partnerships for the Goals</h3>
      <p>Strengthen implementation means and revitalize global partnerships for sustainable development.</p>

      <h2>How Your Work Contributes</h2>
      <p>Every volunteer activity or donation contributes to one or more SDGs. For example:</p>
      <ul>
        <li>Teaching children contributes to SDG 4 (Quality Education)</li>
        <li>Medical camps contribute to SDG 3 (Good Health)</li>
        <li>Tree plantation drives contribute to SDG 13 (Climate Action) and SDG 15 (Life on Land)</li>
        <li>Women's empowerment programs contribute to SDG 5 (Gender Equality)</li>
      </ul>

      <h2>Tracking Your Impact</h2>
      <p>Platforms like ServeSphere help you track which SDGs your activities contribute to. This helps you understand your global impact and align your efforts with international development priorities.</p>

      <h2>The Path Forward</h2>
      <p>We're now past the halfway point to 2030. While progress has been made, much work remains. Every individual action counts. By understanding the SDGs and aligning your efforts with them, you become part of a global movement for positive change.</p>
    `,
  },
];

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-ink mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-teal hover:underline">
                ← Back to Blog
              </Link>
            </div>
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-sand">
          {/* Hero Section */}
          <section className={`relative ${post.thumbnail} text-white py-32 overflow-hidden`}>
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
    
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-white/80">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-white/80">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
    
                <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                  {post.title}
                </h1>
    
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-white/70">Author</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
    
          {/* Article Content */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm"
              >
                {/* Share Buttons */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                  <p className="text-muted text-sm">Share this article:</p>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-sand hover:bg-teal-light text-muted hover:text-teal transition-colors flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-sand hover:bg-coral-light text-muted hover:text-coral transition-colors flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
    
                {/* Article Body */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-serif prose-headings:text-ink
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-muted prose-p:leading-relaxed prose-p:mb-6
                    prose-ul:text-muted prose-ul:my-6
                    prose-li:my-2
                    prose-strong:text-ink prose-strong:font-semibold
                    prose-a:text-teal prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </motion.div>
    
              {/* Related Articles */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mt-16"
              >
                <h2 className="font-serif text-3xl text-ink mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {BLOG_POSTS.filter(p => p.id !== post.id && p.category === post.category)
                    .slice(0, 2)
                    .map(relatedPost => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.slug}`}
                        className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center gap-3 text-xs text-muted mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(relatedPost.date).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span>•</span>
                          <span>{relatedPost.readTime}</span>
                        </div>
                        <h3 className="font-serif text-xl text-ink mb-2 group-hover:text-teal transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </Link>
                    ))}
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      );
    }
