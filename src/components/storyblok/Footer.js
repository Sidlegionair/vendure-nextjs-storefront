import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import RichTextEditor from '@/src/components/storyblok/RichTextEditor';

const getButtonLink = (link) => {
    if (!link) return '#'; // Default fallback

    if (link.linktype === 'url') {
        const url = link.url;
        // If URL doesn't start with http:// or https://, prepend https://
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`;
        }
        return url;
    }

    if (link.linktype === 'story') return `/${link.cached_url || ''}`; // Internal Storyblok story

    return '#'; // Fallback for unknown types
};

const Footer = ({ blok }) => {
    const {
        background,
        logo,
        name,
        description,
        columns = [],
        newsletter_placeholder,
        social_links = [],
    } = blok;

    const limitedColumns = columns.slice(0, 5); // Limit to 5 columns

    return (
        <footer {...storyblokEditable(blok)} className="footer">
            <div className="content-layer">
                {/* Brand Section */}
                <div className="brand-section">
                    <div className="logo">
                        {logo?.filename && (
                            <img
                                src={logo.filename}
                                alt={name || 'Logo'}
                                className="logo-image"
                            />
                        )}
                    </div>
                    {description && (
                        <RichTextEditor blok={{ content: description, textColor: '#fff' }} />
                    )}
                </div>

                {/* Links Section */}
                <div className={`links-section columns-${limitedColumns.length}`}>
                    {limitedColumns.map((column, index) => (
                        <div key={index} className="column">
                            <h4 className="column-title">{column.title}</h4>
                            <ul className="link-list">
                                {column.links.map((link, i) => (
                                    <li key={i} className="link-item">
                                        <a
                                            href={getButtonLink(link.url)}
                                            className="link"
                                            target={link.url?.target || '_self'}
                                            rel={link.url?.target === '_blank' ? 'noopener noreferrer' : undefined}
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter and Social Links Section */}
                <div className="newsletter-section">
                    <div className="email-wrapper">
                        <input
                            type="email"
                            placeholder={newsletter_placeholder}
                            className="email-input"
                        />
                        <button className="send-button">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M23.7766 0.337106C23.8824 0.443068 23.9547 0.577778 23.9846 0.724502C24.0145 0.871226 24.0006 1.0235 23.9447 1.1624L15.0525 23.395C14.9741 23.5907 14.8433 23.7611 14.6743 23.8873C14.5054 24.0135 14.3049 24.0907 14.095 24.1103C13.885 24.1299 13.6737 24.0912 13.4843 23.9984C13.295 23.9056 13.1348 23.7624 13.0216 23.5845L8.16521 15.9505L0.532179 11.0935C0.353873 10.9803 0.21028 10.8202 0.117244 10.6306C0.0242089 10.441 -0.0146521 10.2294 0.00494948 10.0191C0.0245511 9.80886 0.101853 9.60809 0.228326 9.43898C0.354799 9.26987 0.525526 9.139 0.721667 9.06079L22.9514 0.170519C23.0903 0.114601 23.2426 0.100724 23.3893 0.130612C23.536 0.1605 23.6707 0.232836 23.7766 0.338635V0.337106ZM9.69029 15.5042L13.9095 22.1341L21.1421 4.05094L9.69029 15.5042ZM20.0617 2.97041L1.98085 10.204L8.61142 14.4222L20.0617 2.97041Z"
                                    fill="#9E2E3A" />
                            </svg>
                        </button>
                    </div>
                    <div className="social-icons">
                        {social_links.map((social, index) => (
                            <a
                                key={index}
                                href={getButtonLink(social.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            >
                                {social.icon?.filename && (
                                    <img
                                        src={social.icon.filename}
                                        alt={social.name || 'Social Icon'}
                                        className="icon-image"
                                    />
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .footer {
                    position: relative;
                    color: #fff;
                    padding: 60px 20px;
                    width: 100%;
                    box-sizing: border-box;
                    overflow: hidden; /* Ensures no overflow */
                    margin-top: 100px;
                }

                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url(${background?.filename});
                    background-size: cover;
                    background-position: center;
                    z-index: 0;
                }

                .footer::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    z-index: 1;
                    opacity: 0.9;
                }

                .content-layer {
                    position: relative;
                    z-index: 2;
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    gap: 40px;
                    flex-wrap: wrap;
                    box-sizing: border-box;
                }

                .column {
                    justify-content: start;
                    align-items: start;
                    text-align: start;
                }

                .brand-section {
                    flex: 1 1 250px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    text-align: left;
                    min-width: 250px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logo-image {
                    width: 100%;
                    max-width: 288px;
                    height: auto;
                    display: block;
                }

                .links-section {
                    display: flex;
                    flex: 1 1 400px;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: flex-start;
                    min-width: 300px;
                }

                .links-section.columns-3,
                .links-section.columns-4,
                .links-section.columns-5 {
                    justify-content: space-between;
                }

                .column {
                    flex: 1 1 calc(33.333% - 20px);
                    min-width: 150px;
                    box-sizing: border-box;
                }

                .column-title {
                    font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                }

                .link-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .link-item {
                    margin-bottom: 8px;
                }

                .link {
                    color: #fff;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 24px;
                    text-decoration: none;
                }

                .newsletter-section {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 15px; /* Space between the input and social icons */
                    width: 100%;
                    max-width: 250px;
                }

                .email-wrapper {
                    position: relative;
                    width: 100%;
                }

                .email-input {
                    background: #ffffff;
                    padding: 15px;
                    font-size: 16px;
                    font-family: 'Calibri', sans-serif;
                    color: #333;
                    border: 1px solid #fff;
                    width: 100%;
                    box-sizing: border-box;
                    max-width: 100%;
                    /*border-radius: 30px;*/
                    padding-right: 50px; /* Space for the button */
                }

                .send-button {
                    position: absolute;
                    right: 10px; /* Inside the input */
                    top: 50%;
                    transform: translateY(-50%);
                    border: none;
                    /*background-color: #c00;*/
                    color: #fff;
                    padding: 10px 15px;
                    font-size: 14px;
                    /*border-radius: 50%;*/
                    cursor: pointer;
                }

                .email-input::placeholder {
                    font-family: 'Calibri', sans-serif;
                    font-style: normal;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 24px; /* Identical to box height, or 150% */
                    color: #4D4D4D;
                }

                .social-icons {
                    display: flex;
                    gap: 15px;
                }

                .social-icon {
                    display: inline-flex;
                    width: 42px;
                    height: 42px;
                }

                .icon-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                @media (max-width: 1024px) {
                    .content-layer {
                        gap: 30px;
                    }
                }

                @media (max-width: 768px) {
                    .content-layer {
                        padding: 30px;
                        flex-direction: column-reverse;
                        align-items: start;
                    }

                    .logo {
                        align-items: start;
                    }

                    .brand-section,
                    .links-section,
                    .newsletter-section {
                        text-align: start;
                        align-items: start;
                    }

                    .newsletter-section {
                        flex-direction: column-reverse;
                    }

                    .links-section {
                        justify-content: start;
                    }

                    .column {
                        flex: 1 1 100%;
                        max-width: 300px;
                        text-align: left;
                    }

                    .email-input {
                        max-width: 100%;
                    }

                    .send-button {
                        margin: 10px 0;
                    }

                    .social-icons {
                        justify-content: center;
                    }

                    .logo-image {
                        /*max-width: 150px;*/
                        max-height: 28px;
                    }
                }

                @media (max-width: 480px) {
                    .column-title {
                        font-size: 18px;
                    }

                    .link {
                        font-size: 14px;
                    }

                    .email-input,
                    .send-button {
                        font-size: 14px;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
