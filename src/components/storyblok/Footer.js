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
                    {logo?.filename && (

                        <div className="logo">
                            <img
                                src={logo.filename}
                                alt={name || 'Logo'}
                                className="logo-image"
                            />
                        </div>
                    )}

                    {description && (
                        <RichTextEditor blok={{ content: description, textColor: '#fff' }} />
                    )}
                </div>

                {/* Links Section */}
                <div className={`links-section columns-${limitedColumns.length}`}>
                    {limitedColumns.map((column, index) => (
                        <div key={index} className="column">
                            <h5 className="column-title">{column.title}</h5>
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
                        <div className="klaviyo-form-VUnBaH"></div>
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
                    * {
                        font-family: 'Suisse BP Int\'l' !important;

                    }

                    .brand-section {
                        p {
                            font-family: 'Suisse BP Int\'l' !important;
                            //font-style: normal;
                            //font-weight: 400;
                            //font-size: 18px;
                            //line-height: 26px;
                            /* or 144% */
                        }

                        span {
                            font-family: 'Suisse BP Int\'l' !important;
                            //font-style: normal;
                            //font-weight: 400;
                            //font-size: 18px;
                            //line-height: 26px;
                            /* or 144% */
                        }

                        * {
                            font-family: 'Suisse BP Int\'l' !important;

                        }
                    }
                }

                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url(${background?.filename + '/m/'});
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
                    //font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 20px;
                    //text-transform: uppercase;
                }

                .link-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                //.link-item {
                //    margin-bottom: 8px;
                //}

                .link {
                    color: #fff;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 40px;
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
